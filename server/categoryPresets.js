const categoryPresets = {
    PRIVATE: {LIGHTS: [], THERMOSTAT:[], LOCKS:[]},
    PARTLY_PRIVATE: {LIGHTS: ['ENERGY_COMPANY'], THERMOSTAT:['ENERGY_COMPANY'], LOCKS:[]},
    MIXED: {LIGHTS: ['ENERGY_COMPANY', 'MANUFACTURER'], THERMOSTAT:['ENERGY_COMPANY', 'MANUFACTURER'], LOCKS:['MANUFACTURER']},
    PARTLY_PUBLIC: {LIGHTS: ['ENERGY_COMPANY', 'MANUFACTURER', 'OTHERS'], THERMOSTAT:['ENERGY_COMPANY', 'MANUFACTURER'], LOCKS:['ENERGY_COMPANY', 'MANUFACTURER']},
    PUBLIC: {LIGHTS: ['ENERGY_COMPANY', 'MANUFACTURER', 'OTHERS'], THERMOSTAT:['ENERGY_COMPANY', 'MANUFACTURER', 'OTHERS'], LOCKS:['ENERGY_COMPANY', 'MANUFACTURER', 'OTHERS']}
}

module.exports = categoryPresets;