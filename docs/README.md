# Documentation for GapTasks v1.0.0

## Database Schema

See the [schema documentation](./db-schema.md) for details.

## RESTful Data Transformation
We don't want to just dump data directly from out database onto our users. Instead, the following API endpoints have been defined:
- [Users](./rest-users.md)
- [Stacks](./rest-stacks.md)
- [Tasks](./rest-tasks.md)

### REST Response Format
In addition to the formats specified above, EVERY response will be returned from the api server in the following format:

```json5
{
    "api": "<version>", // The version of the API that responded to the request
    "success": true,    // Whether the request was successful (for convenience)
    "status": "",       // The string HTTP status type (for convenience)
    "message": "",      // A message from the server
    "content": {}       // The response content, determined by the RESTful objects defined above
}
```

In the content body there will always be at least one JSON property with the key`"_links"`. These properties contain API endpoints for additional information about the resource. One link to be aware is the `self` link. The `self` link points to the parent resource object. For example, if the response content is structured as follows:

```json5
{
    "foo": {
        "bar": {
            "_links": {
                "self": "/data/bar"
            }
        },
        "_links": {
            "self": "/data/foo"
        }
    }
}
```

Then the `_links.self` field under `"foo"` refers to the Foo object instance, and the `_links.self` field under `"bar"` refers to the Bar object instance. Having these links is very useful and follows REST protocols.