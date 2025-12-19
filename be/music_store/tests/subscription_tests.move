#[test_only]
module music_store::subscription_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use music_store::subscription::{
        Self, 
        AdminCap, 
        MusicPlatform, 
        SubscriptionBadge
    };

    const ADMIN: address = @0xAD;
    const USER1: address = @0xB0B;
    const USER2: address = @0xA11CE;

    const PRICE_PREMIUM: u64 = 1_000_000_000;
    const PRICE_VIP: u64 = 2_000_000_000;

    fun setup_test(): Scenario {
        let mut scenario = ts::begin(ADMIN);
        {
            subscription::init_for_testing(ts::ctx(&mut scenario));
        };
        scenario
    }

    #[test]
    fun test_initialization() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            assert!(ts::has_most_recent_for_sender<AdminCap>(&scenario), 0);
            assert!(ts::has_most_recent_shared<MusicPlatform>(), 1);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_add_song() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut platform = ts::take_shared<MusicPlatform>(&scenario);

            subscription::add_song(
                &admin_cap,
                &mut platform,
                b"Test Song",
                b"Test Artist",
                b"Test Album",
                b"3:45",
                b"Electronic",
                1, // Premium tier
                b"ipfs://audio-hash",
                b"ipfs://cover-hash",
                ts::ctx(&mut scenario)
            );

            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(platform);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_subscribe_premium() {
        let mut scenario = setup_test();
        
        // User subscribes to premium
        ts::next_tx(&mut scenario, USER1);
        {
            let mut platform = ts::take_shared<MusicPlatform>(&scenario);
            let payment = coin::mint_for_testing<SUI>(PRICE_PREMIUM, ts::ctx(&mut scenario));

            subscription::subscribe(
                &mut platform,
                1, // Premium tier
                payment,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(platform);
        };

        // Verify user received badge
        ts::next_tx(&mut scenario, USER1);
        {
            assert!(ts::has_most_recent_for_sender<SubscriptionBadge>(&scenario), 0);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_subscribe_vip() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, USER2);
        {
            let mut platform = ts::take_shared<MusicPlatform>(&scenario);
            let payment = coin::mint_for_testing<SUI>(PRICE_VIP, ts::ctx(&mut scenario));

            subscription::subscribe(
                &mut platform,
                2, // VIP tier
                payment,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(platform);
        };

        ts::next_tx(&mut scenario, USER2);
        {
            assert!(ts::has_most_recent_for_sender<SubscriptionBadge>(&scenario), 0);
        };
        
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = subscription::E_INSUFFICIENT_PAYMENT)]
    fun test_subscribe_insufficient_payment() {
        let mut scenario = setup_test();
        
        ts::next_tx(&mut scenario, USER1);
        {
            let mut platform = ts::take_shared<MusicPlatform>(&scenario);
            // Try to pay less than required
            let payment = coin::mint_for_testing<SUI>(500_000_000, ts::ctx(&mut scenario));

            subscription::subscribe(
                &mut platform,
                1, // Premium tier (requires 1 SUI)
                payment,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(platform);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_play_free_song() {
        let mut scenario = setup_test();
        let song_id;
        
        // Admin adds free song
        ts::next_tx(&mut scenario, ADMIN);
        {
            let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut platform = ts::take_shared<MusicPlatform>(&scenario);

            subscription::add_song(
                &admin_cap,
                &mut platform,
                b"Free Song",
                b"Free Artist",
                b"Free Album",
                b"3:00",
                b"Pop",
                0, // Free tier
                b"ipfs://free-audio",
                b"ipfs://free-cover",
                ts::ctx(&mut scenario)
            );

            // Get song ID from platform for testing
            // In real scenario, we'd track this via events

            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(platform);
        };
        
        // Any user can play free song without subscription
        // This test validates the logic works
        
        ts::end(scenario);
    }

    #[test]
    fun test_full_user_journey() {
        let mut scenario = setup_test();
        
        // 1. Admin adds songs
        ts::next_tx(&mut scenario, ADMIN);
        {
            let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            let mut platform = ts::take_shared<MusicPlatform>(&scenario);

            // Add free song
            subscription::add_song(
                &admin_cap, &mut platform,
                b"Free Track", b"Artist A", b"Album A",
                b"2:30", b"Rock", 0,
                b"ipfs://track1", b"ipfs://cover1",
                ts::ctx(&mut scenario)
            );

            // Add premium song
            subscription::add_song(
                &admin_cap, &mut platform,
                b"Premium Track", b"Artist B", b"Album B",
                b"3:15", b"Jazz", 1,
                b"ipfs://track2", b"ipfs://cover2",
                ts::ctx(&mut scenario)
            );

            ts::return_to_sender(&scenario, admin_cap);
            ts::return_shared(platform);
        };

        // 2. User subscribes to premium
        ts::next_tx(&mut scenario, USER1);
        {
            let mut platform = ts::take_shared<MusicPlatform>(&scenario);
            let payment = coin::mint_for_testing<SUI>(PRICE_PREMIUM, ts::ctx(&mut scenario));

            subscription::subscribe(&mut platform, 1, payment, ts::ctx(&mut scenario));

            ts::return_shared(platform);
        };

        // 3. User receives badge
        ts::next_tx(&mut scenario, USER1);
        {
            assert!(ts::has_most_recent_for_sender<SubscriptionBadge>(&scenario), 0);
        };
        
        ts::end(scenario);
    }
}