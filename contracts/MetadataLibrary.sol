// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

library MetadataLibrary {
    struct Attribute {
        string displayType;
        string keyType;
        string valueType;
        string tagKey;
        string tagValue;
        string tagType;
    }

    struct Property {
        string key;
        string value;
    }

    struct Metadata {
        Property[] properties;
        Attribute[] attributes;
    }
}
