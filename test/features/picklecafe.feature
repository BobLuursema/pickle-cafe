Feature: Test PickleCafé

    @testcafe
    Scenario: Generic test
        Given a user with name "test"
        When the user types their name and submits
        Then the thank you message appears

    @testcafe
    Scenario: Client function test
        When a client function is called
        Then the url is available

    @testcafe
    Scenario: Generic error test
        Given a user with name "test"
        When the user types their name and submits
        Then the test fails
    
    Scenario: No TestCafe
        When a scenario has no TestCafe
        Then TestCafe is not booted