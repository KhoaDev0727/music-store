module music_store::subscription {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::table::{Self, Table};
    use sui::event;

    // =================== Error Codes ===================
    const E_INSUFFICIENT_PAYMENT: u64 = 1;
    const E_INVALID_TIER: u64 = 2;
    const E_NOT_AUTHORIZED: u64 = 3;
    const E_SUBSCRIPTION_EXPIRED: u64 = 4;

    // =================== Subscription Tiers ===================
    const TIER_FREE: u8 = 0;
    const TIER_PREMIUM: u8 = 1;
    const TIER_VIP: u8 = 2;

    // Prices in MIST (1 SUI = 1_000_000_000 MIST)
    const PRICE_FREE: u64 = 0;
    const PRICE_PREMIUM: u64 = 1_000_000_000; // 1 SUI per month
    const PRICE_VIP: u64 = 2_000_000_000; // 2 SUI per month

    // Duration in milliseconds (30 days)
    const SUBSCRIPTION_DURATION: u64 = 2_592_000_000; // 30 days in ms

    // =================== Structs ===================
    
    /// Platform admin capability
    public struct AdminCap has key, store {
        id: UID
    }

    /// Main platform object
    public struct MusicPlatform has key {
        id: UID,
        treasury: Balance<SUI>,
        total_subscribers: u64,
        songs: Table<ID, Song>,
        subscriptions: Table<address, UserSubscription>,
        version: u64
    }

    /// Song metadata stored on-chain
    public struct Song has key, store {
        id: UID,
        title: vector<u8>,
        artist: vector<u8>,
        album: vector<u8>,
        duration: vector<u8>,
        genre: vector<u8>,
        tier_required: u8, // 0=free, 1=premium, 2=vip
        audio_url: vector<u8>, // IPFS or server URL
        cover_url: vector<u8>,
        plays: u64,
        created_at: u64
    }

    /// User subscription record
    public struct UserSubscription has store, copy, drop {
        tier: u8,
        expires_at: u64,
        started_at: u64,
        auto_renew: bool
    }

    /// NFT subscription badge (transferable)
    public struct SubscriptionBadge has key, store {
        id: UID,
        tier: u8,
        owner: address,
        expires_at: u64,
        metadata_url: vector<u8>
    }

    // =================== Events ===================
    
    public struct SubscriptionPurchased has copy, drop {
        user: address,
        tier: u8,
        amount_paid: u64,
        expires_at: u64,
        timestamp: u64
    }

    public struct SongAdded has copy, drop {
        song_id: ID,
        title: vector<u8>,
        artist: vector<u8>,
        tier_required: u8
    }

    public struct SongPlayed has copy, drop {
        song_id: ID,
        user: address,
        timestamp: u64
    }

    // =================== Initialization ===================
    
    fun init(ctx: &mut TxContext) {
        // Create admin capability
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };

        // Create platform
        let platform = MusicPlatform {
            id: object::new(ctx),
            treasury: balance::zero(),
            total_subscribers: 0,
            songs: table::new(ctx),
            subscriptions: table::new(ctx),
            version: 1
        };

        // Transfer admin cap to deployer
        transfer::transfer(admin_cap, tx_context::sender(ctx));
        
        // Share platform object
        transfer::share_object(platform);
    }

    // =================== Admin Functions ===================
    
    /// Add new song to platform (admin only) - entry function wrapper
    entry fun add_song_entry(
        _admin: &AdminCap,
        platform: &mut MusicPlatform,
        title: vector<u8>,
        artist: vector<u8>,
        album: vector<u8>,
        duration: vector<u8>,
        genre: vector<u8>,
        tier_required: u8,
        audio_url: vector<u8>,
        cover_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        add_song(_admin, platform, title, artist, album, duration, genre, tier_required, audio_url, cover_url, ctx);
    }

    /// Add new song to platform (admin only)
    public fun add_song(
        _admin: &AdminCap,
        platform: &mut MusicPlatform,
        title: vector<u8>,
        artist: vector<u8>,
        album: vector<u8>,
        duration: vector<u8>,
        genre: vector<u8>,
        tier_required: u8,
        audio_url: vector<u8>,
        cover_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tier_required <= TIER_VIP, E_INVALID_TIER);

        let song = Song {
            id: object::new(ctx),
            title,
            artist,
            album,
            duration,
            genre,
            tier_required,
            audio_url,
            cover_url,
            plays: 0,
            created_at: tx_context::epoch_timestamp_ms(ctx)
        };

        let song_id = object::id(&song);

        event::emit(SongAdded {
            song_id,
            title: song.title,
            artist: song.artist,
            tier_required: song.tier_required
        });

        table::add(&mut platform.songs, song_id, song);
    }

    /// Remove song from platform (admin only) - entry function wrapper
    entry fun remove_song_entry(
        _admin: &AdminCap,
        platform: &mut MusicPlatform,
        song_id: ID,
    ) {
        remove_song(_admin, platform, song_id);
    }

    /// Remove song from platform (admin only)
    public fun remove_song(
        _admin: &AdminCap,
        platform: &mut MusicPlatform,
        song_id: ID,
    ) {
        let Song { 
            id, title: _, artist: _, album: _, duration: _, 
            genre: _, tier_required: _, audio_url: _, 
            cover_url: _, plays: _, created_at: _ 
        } = table::remove(&mut platform.songs, song_id);
        object::delete(id);
    }

    /// Withdraw treasury funds (admin only) - entry function wrapper
    entry fun withdraw_treasury_entry(
        _admin: &AdminCap,
        platform: &mut MusicPlatform,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        withdraw_treasury(_admin, platform, amount, recipient, ctx);
    }

    /// Withdraw treasury funds (admin only)
    public fun withdraw_treasury(
        _admin: &AdminCap,
        platform: &mut MusicPlatform,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let withdrawn = coin::take(&mut platform.treasury, amount, ctx);
        transfer::public_transfer(withdrawn, recipient);
    }

    // =================== User Functions ===================
    
    /// Subscribe to a tier (entry function wrapper)
    entry fun subscribe_entry(
        platform: &mut MusicPlatform,
        tier: u8,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        subscribe(platform, tier, payment, ctx);
    }

    /// Subscribe to a tier
    #[allow(lint(self_transfer))]
    public fun subscribe(
        platform: &mut MusicPlatform,
        tier: u8,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(tier <= TIER_VIP, E_INVALID_TIER);
        
        let user = tx_context::sender(ctx);
        let price = get_tier_price(tier);
        let payment_value = coin::value(&payment);

        assert!(payment_value >= price, E_INSUFFICIENT_PAYMENT);

        // Add payment to treasury
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut platform.treasury, payment_balance);

        let now = tx_context::epoch_timestamp_ms(ctx);
        let expires_at = now + SUBSCRIPTION_DURATION;

        // Create or update subscription
        let mut subscription = UserSubscription {
            tier,
            expires_at,
            started_at: now,
            auto_renew: false
        };

        if (table::contains(&platform.subscriptions, user)) {
            let old_sub = table::remove(&mut platform.subscriptions, user);
            // If extending existing subscription, add remaining time
            if (old_sub.expires_at > now && old_sub.tier == tier) {
                subscription.expires_at = old_sub.expires_at + SUBSCRIPTION_DURATION;
            };
        } else {
            platform.total_subscribers = platform.total_subscribers + 1;
        };

        table::add(&mut platform.subscriptions, user, subscription);

        // Create subscription badge NFT
        let badge = SubscriptionBadge {
            id: object::new(ctx),
            tier,
            owner: user,
            expires_at,
            metadata_url: b"ipfs://subscription-metadata"
        };

        transfer::transfer(badge, user);

        event::emit(SubscriptionPurchased {
            user,
            tier,
            amount_paid: payment_value,
            expires_at,
            timestamp: now
        });
    }

    /// Play a song (requires valid subscription) - entry function wrapper
    entry fun play_song_entry(
        platform: &mut MusicPlatform,
        song_id: ID,
        ctx: &mut TxContext
    ) {
        play_song(platform, song_id, ctx);
    }

    /// Play a song (requires valid subscription)
    public fun play_song(
        platform: &mut MusicPlatform,
        song_id: ID,
        ctx: &mut TxContext
    ) {
        let user = tx_context::sender(ctx);
        let now = tx_context::epoch_timestamp_ms(ctx);

        // Get song
        let song = table::borrow_mut(&mut platform.songs, song_id);
        
        // Check subscription
        if (song.tier_required > TIER_FREE) {
            assert!(table::contains(&platform.subscriptions, user), E_NOT_AUTHORIZED);
            let subscription = table::borrow(&platform.subscriptions, user);
            assert!(subscription.expires_at > now, E_SUBSCRIPTION_EXPIRED);
            assert!(subscription.tier >= song.tier_required, E_NOT_AUTHORIZED);
        };

        // Increment play count
        song.plays = song.plays + 1;

        event::emit(SongPlayed {
            song_id,
            user,
            timestamp: now
        });
    }

    // =================== View Functions ===================
    
    /// Get subscription details
    public fun get_subscription(
        platform: &MusicPlatform,
        user: address
    ): (u8, u64, bool) {
        if (!table::contains(&platform.subscriptions, user)) {
            return (TIER_FREE, 0, false)
        };
        
        let sub = table::borrow(&platform.subscriptions, user);
        (sub.tier, sub.expires_at, sub.auto_renew)
    }

    /// Check if user can access song
    public fun can_access_song(
        platform: &MusicPlatform,
        user: address,
        song_id: ID,
        ctx: &TxContext
    ): bool {
        let song = table::borrow(&platform.songs, song_id);
        
        if (song.tier_required == TIER_FREE) {
            return true
        };

        if (!table::contains(&platform.subscriptions, user)) {
            return false
        };

        let subscription = table::borrow(&platform.subscriptions, user);
        let now = tx_context::epoch_timestamp_ms(ctx);
        
        subscription.tier >= song.tier_required && subscription.expires_at > now
    }

    /// Get tier price
    public fun get_tier_price(tier: u8): u64 {
        if (tier == TIER_FREE) {
            PRICE_FREE
        } else if (tier == TIER_PREMIUM) {
            PRICE_PREMIUM
        } else if (tier == TIER_VIP) {
            PRICE_VIP
        } else {
            abort E_INVALID_TIER
        }
    }

    /// Get song details
    public fun get_song_info(
        platform: &MusicPlatform,
        song_id: ID
    ): (vector<u8>, vector<u8>, u8, u64) {
        let song = table::borrow(&platform.songs, song_id);
        (song.title, song.artist, song.tier_required, song.plays)
    }

    // =================== Test Functions ===================
    
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}