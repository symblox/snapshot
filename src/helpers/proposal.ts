export const TARGETS = {
    '106': {
        rewardManager: {
            address: '0x9fCdD9eb40CaC90A5C385C9Ef37b48E847B178a3',
            actions: [
                {
                    signature: 'add(uint256,address,bool)',
                    params: ['alloc point(number)', 'lp token(address)', 'with update(bool)'],
                    types: ['uint256', 'address', 'bool'],
                    formats: ['toWei', '', 'bool']
                },
                {
                    signature: 'set(uint256,uint256,bool)',
                    params: ['reward pool id(number)', 'alloc point(number)', 'with update(bool)'],
                    types: ['uint256', 'uint256', 'bool'],
                    formats: ['', 'toWei', 'bool']
                },
                {
                    signature: 'startNewSeason()',
                    params: [],
                    types: [],
                    formats: []
                }
            ]
        },
        connectorFactory: {
            address: '0xBE6A1f0b0236BB39E0b16B0fc5cb6C291fFdFC2E',
            actions: [
                {
                    signature: 'setConnectorImpl(uint8,address)',
                    params: ['reward pool id(number)', 'implementation(address)'],
                    types: ['uint8', 'address'],
                    formats: ['', '']
                }
            ]
        }
    },
    '111': {
        symblox: {
            address: '0xBfb78Cc60F388Bf4A0a3449ab66DA152c258614C',
            actions: [
                {
                    signature: 'mint(address,uint256)',
                    params: ['target address(address)', 'mint amount(number)'],
                    types: ['address', 'uint256'],
                    formats: ['', 'toWei']
                },
                {
                    signature: 'approve(address,uint256)',
                    params: ['target address(address)', 'approve amount(number)'],
                    types: ['address', 'uint256'],
                    formats: ['', 'toWei']
                }
            ]
        },
        omnibridge: {
            address: '0xF058A68E14e0f4dd3DDf265c67b3898639A74a1f',
            actions: [
                {
                    signature: 'relayTokens(address,address,uint256)',
                    params: [
                        'token address(address)',
                        'target address(address)',
                        'omni amount(number)'
                    ],
                    types: ['address', 'address', 'uint256'],
                    formats: ['', '', 'toWei']
                }
            ]
        },
        rewardManager: {
            address: '0x009430A9f25654Ee6e27E94fE277B68f115150D0',
            actions: [
                {
                    signature: 'add(uint256,address,bool)',
                    params: ['alloc point(number)', 'lp token(address)', 'with update(bool)'],
                    types: ['uint256', 'address', 'bool'],
                    formats: ['toWei', '', 'bool']
                },
                {
                    signature: 'set(uint256,uint256,bool)',
                    params: ['reward pool id(number)', 'alloc point(number)', 'with update(bool)'],
                    types: ['uint256', 'uint256', 'bool'],
                    formats: ['', 'toWei', 'bool']
                }
            ]
        },
        connectorFactory: {
            address: '0x9B666C4B5C7dF17b80f5e2a34f61111dD29720D9',
            actions: [
                {
                    signature: 'setConnectorImpl(uint8,address)',
                    params: ['reward pool id(number)', 'implementation(address)'],
                    types: ['uint8', 'address'],
                    formats: ['', '']
                }
            ]
        }
    }
};
