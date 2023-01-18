export type AmplifyDependentResourcesAttributes = {
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
    "function": {
        "tennisreact9ea7bf97DefineAuthChallenge": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        },
        "tennisreact9ea7bf97CreateAuthChallenge": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        },
        "tennisreact9ea7bf97VerifyAuthChallengeResponse": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        },
        "tennisreact9ea7bf97CustomMessage": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        },
        "tennisreact9ea7bf97PostConfirmation": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        }
    },
    "storage": {
        "profilePics": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "api": {
        "tennisreact": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "geo": {
        "TSPlaceIndex": {
            "Name": "string",
            "Region": "string",
            "Arn": "string"
        },
        "TSMap": {
            "Name": "string",
            "Style": "string",
            "Region": "string",
            "Arn": "string"
        }
    }
}