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
    "storage": {
        "profilePics": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "geo": {
        "MyTennisGeoIndex": {
            "Name": "string",
            "Region": "string",
            "Arn": "string"
        },
        "MyTennisMap": {
            "Name": "string",
            "Style": "string",
            "Region": "string",
            "Arn": "string"
        }
    }
}