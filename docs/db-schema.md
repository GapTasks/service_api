# GapTasks Database Schema

The GapTasks service uses a NoSQL database to persist user data. This document describes the schema for how that data should be stored. The database will comprise of three collections.
- A `users` collection containing User data (User[])
- A `stacks` collection containing stack data (Stack[])
- A `tasks` collection containing task data (Task[])

## User

| Name | Type | Description |
|:---|:---|:---|
| `username` | string | the username defined by the user that can uniquely identify this user |
| `name` | string | the name of the user |
| `email` | string | the email address of the user |
| `stacks` | UUID[] | an array of stack ids pointing to stacks the user owns |

## Stack

| Name | Type | Description |
|:---|:---|:---|
| `id` | UUID | |
| `name` | string | the title of the stack |
| `deadline` | UNIX timestamp | when the stack is due |
| `priority` | number | a number between 1 and 10 indicating the priority of the stack |

## Task

| Name | Type | Description |
|:---|:---|:---|
| `id` | UUID | |
| `name` | string | the title of the task |
| `deadline` | UNIX timestamp | when the task is due |
| `mood` | number | indicates the mood of the task to help the service schedule it appropriately |
| `time_needed` | number | the amount of time in seconds needed for the task to be completed |
| `stack` | UUID | the stack to which the task belongs |
