export type AmplifyDependentResourcesAttributes = {
    "api": {
        "MyTennisAPIProd": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "auth": {
        "tennisreact": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "HostedUIDomain": "string",
            "OAuthMetadata": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "storage": {
        "profilePics": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "geo": {
        "MyTennisSpaceGEO": {
            "Name": "string",
            "Region": "string",
            "Arn": "string"
        }
    }
}