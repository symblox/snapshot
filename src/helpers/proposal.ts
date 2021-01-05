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
        rewardManager: {
            address: '0x8b2B0CE402b33b5A2744371311E3053EAB2E2f3d',
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
            address: '0xff165a0eeCc3CcB0057e7a8cf7E83Af4ea4d253a',
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
