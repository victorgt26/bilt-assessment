package com.rentrewards.challenge.service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Tracks which webhook events have already been processed, so that the
 * RewardsEngine can ignore duplicate deliveries from the payment processor.
 */
public class ProcessedEventStore {

    private final Set<String> claimedEventIds = ConcurrentHashMap.newKeySet();

    /**
     * Atomically claims an event before processing; only one worker can succeed.
     * @return true if this worker claimed the event, false if already claimed.
     */
    public boolean claim(String eventId) {
        return claimedEventIds.add(eventId);
    }
}
