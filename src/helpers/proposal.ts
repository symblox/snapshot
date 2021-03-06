export const TARGETS = {
    '106': {
        symblox: {
            address: '0xD0CB9244844F3E11061fb3Ea136Aab3a6ACAC017',
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
            address: '0xC119b1d91b44012Db8d0ac5537f04c7FD7629c84',
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
            address: '0x7924a8d124C04492c8653912004532C2a9CDFe59',
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
            address: '0x6C7D0CB3a0524BA91969Dd468313d34370c4b189',
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
