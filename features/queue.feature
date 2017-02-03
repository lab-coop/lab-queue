Feature: Queue
  Scenario: Check message count on a not existent queue
    Given "test-queue" doesn't exist
    When "test-queue" contains 1 message
    Then the last operation thrown error

  Scenario: Consumer count on a not existent queue
    Given "test-queue" doesn't exist
    When "test-queue" has 1 consumer
    Then the last operation thrown error

  Scenario: A message is pushed to the queue without a consumer
    Given "test-queue" doesn't exist
    When a random message pushed to queue "test-queue"
    Then "test-queue" contains 1 message
    And the last operation didn't throw error

  Scenario: Two messages is pushed to the queue and the connection is reused
    Given "test-queue" doesn't exist
    When a random message pushed to queue "test-queue"
    And a random message pushed to queue "test-queue"
    Then "test-queue" contains 2 message
    And the last operation didn't throw error

  Scenario: A consumer is attached to the queue
    Given "test-queue" doesn't exist
    When a consumer is attached to queue "test-queue"
    Then "test-queue" has 1 consumer
    And the last operation didn't throw error

  Scenario: Push and pull
    Given "test-queue" doesn't exist
    When the message "message" is pushed to queue "test-queue"
    When a consumer is attached to queue "test-queue"
    Then the consumer is called back with "message"

  Scenario: Pull and push
    Given "test-queue" doesn't exist
    When a consumer is attached to queue "test-queue"
    When the message "message" is pushed to queue "test-queue"
    Then the consumer is called back with "message"
