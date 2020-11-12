export const TARGETS = {
    "106": {
        rewardManager: {
            address: "0x76068bdd1D211A081FBaF3D5513B5e59a7fA3F7b",
            actions: [{
                signature: "add(uint256,IERC20,bool)",
                params: ["alloc point(number)","lp token(address)","with update(bool)"],
                types: ["uint256","IERC20","bool"],
                formats: ["toWei","","bool"],
            },{
                signature: "set(uint256,uint256,bool)",
                params: ["reward pool id(number)","alloc point(number)","with update(bool)"],
                types: ["uint256","uint256","bool"],
                formats: ["","toWei","bool"],
            }]
        },
        connectorFactory: {
            address: "0xE5E29A8aEfa67DAd8A78D44FB5d73807093870e2",
            actions: [{
                signature: "setConnectorImpl(uint8,address)",
                params: ["reward pool id(number)","implementation(address)"],
                types: ["uint8","address"],
                formats: ["",""],
            }]
        }
    },
    "111": {
        rewardManager: {
            address: "0x8b2B0CE402b33b5A2744371311E3053EAB2E2f3d",
            actions: [{
                signature: "add(uint256,IERC20,bool)",
                params: ["alloc point(number)","lp token(address)","with update(bool)"],
                types: ["uint256","IERC20","bool"],
                formats: ["toWei","","bool"],
            },{
                signature: "set(uint256,uint256,bool)",
                params: ["reward pool id(number)","alloc point(number)","with update(bool)"],
                types: ["uint256","uint256","bool"],
                formats: ["","toWei","bool"],
            }]
        },
        connectorFactory: {
            address: "0xE1532372F4592E4B6D4fB666F5F2027847a81A8A",
            actions: [{
                signature: "setConnectorImpl(uint8,address)",
                params: ["reward pool id(number)","implementation(address)"],
                types: ["uint8","address"],
                formats: ["",""],
            }]
        }
    }
}

