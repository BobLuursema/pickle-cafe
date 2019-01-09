Feature: gitlab test

    Scenario: test
        Given a user with username "test" and password "test"
        When the user tries to login
        Then the login fails