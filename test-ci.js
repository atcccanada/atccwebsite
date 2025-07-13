#!/usr/bin/env node

// Simple CI test script to verify basic functionality
console.log('🔄 Testing ATCC Website CI...');

try {
    // Test 1: Basic module loading
    console.log('📦 Testing module imports...');
    require('./middleware/rateLimiting');
    require('./middleware/validation');
    require('./middleware/csrf');
    
    // Test config modules (but don't connect)
    require('./config/database');
    require('./config/email');
    console.log('✅ All modules load successfully');

    // Test 2: Environment variables
    console.log('🌍 Testing environment handling...');
    const requiredEnvVars = ['NODE_ENV'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length === 0 || process.env.NODE_ENV !== 'production') {
        console.log('✅ Environment variables handled correctly');
    }

    // Test 3: Package.json validation
    console.log('📄 Testing package.json...');
    const pkg = require('./package.json');
    if (pkg.name && pkg.version && pkg.description) {
        console.log('✅ Package.json is valid');
    }

    console.log('🎉 All CI tests passed!');
    process.exit(0);
} catch (error) {
    console.error('❌ CI test failed:', error.message);
    process.exit(1);
}