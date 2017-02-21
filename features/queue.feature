Feature: Queue
  Scenario: Check message count on a not existent queue
    Given "test-queue" doesn't exist
    When "test-queue" contains 1 message, catch errors
    Then the last operation thrown error

  Scenario: Consumer count on a not existent queue
    Given "test-queue" doesn't exist
    When "test-queue" has 1 consumer, catch errors
    Then the last operation thrown error

  Scenario: A message is pushed to the queue without a consumer
    Given "test-queue" is an empty, existing queue, without consumer
    And "test-queue" has 0 consumer
    And "test-queue" contains 0 message
    When a random message pushed to queue "test-queue"
    Then "test-queue" contains 1 message

  Scenario: Two messages is pushed to the queue and the connection is reused
    Given "test-queue" is an empty, existing queue, without consumer
    And "test-queue" has 0 consumer
    And "test-queue" contains 0 message
    When a random message pushed to queue "test-queue"
    And a random message pushed to queue "test-queue"
    Then "test-queue" contains 2 message

  Scenario: A consumer is attached to the queue
    Given "test-queue" is an empty, existing queue, without consumer
    And "test-queue" has 0 consumer
    And "test-queue" contains 0 message
    When a consumer is attached to queue "test-queue"
    Then "test-queue" has 1 consumer

  Scenario: Messages are purged
    Given "test-queue" is an empty, existing queue, without consumer
    And "test-queue" has 0 consumer
    And "test-queue" contains 0 message
    When a random message pushed to queue "test-queue"
    And "test-queue" contains 1 message
    And "test-queue" is purged
    Then "test-queue" contains 0 message

  Scenario: Push and pull
    Given "test-queue" is an empty, existing queue, without consumer
    And "test-queue" has 0 consumer
    And "test-queue" contains 0 message
    When the message "message" is pushed to queue "test-queue"
    When a consumer is attached to queue "test-queue"
    Then the consumer is called back with "message"

  Scenario: Pull and push
    Given "test-queue" is an empty, existing queue, without consumer
    And "test-queue" has 0 consumer
    And "test-queue" contains 0 message
    When a consumer is attached to queue "test-queue"
    When the message "message" is pushed to queue "test-queue"
    Then the consumer is called back with "message"

  Scenario: Pull and push and push
    Given "test-queue" is an empty, existing queue, without consumer
    And "test-queue" has 0 consumer
    And "test-queue" contains 0 message
    When a consumer is attached to queue "test-queue"
    When the message "message" is pushed to queue "test-queue"
    When the message "message" is pushed to queue "test-queue"
    Then the consumer is called back "2" times

  Scenario: The consuming method returns a cancel function before calling the consumer callback
    Given "test-queue" is an empty, existing queue, without consumer
    And "test-queue" has 0 consumer
    And "test-queue" contains 0 message
    When the message "message" is pushed to queue "test-queue"
    When a consumer is attached to queue "test-queue" and immediately cancelled
    Then the consumer is called back "0" times
