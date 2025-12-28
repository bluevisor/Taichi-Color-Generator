#!/usr/bin/env node

/**
 * Manual API Test Script
 * 
 * This script tests all API endpoints manually without requiring Jest.
 * Run with: node tests/manual-api-test.js
 * 
 * Or make it executable and run: ./tests/manual-api-test.js
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://taichi.bucaastudio.com/api';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Helper functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
  passedTests++;
  totalTests++;
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
  failedTests++;
  totalTests++;
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

function logSection(message) {
  log(`\n${'='.repeat(60)}`, colors.blue);
  log(`${message}`, colors.blue);
  log(`${'='.repeat(60)}`, colors.blue);
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response;
  } catch (error) {
    logError(`Network error: ${error.message}`);
    return null;
  }
}

// Expected tokens
const EXPECTED_TOKENS = [
  'bg', 'card', 'card2', 'text', 'textMuted', 'textOnColor',
  'primary', 'primaryFg', 'secondary', 'secondaryFg', 'accent', 'accentFg',
  'border', 'ring', 'good', 'goodFg', 'warn', 'warnFg', 'bad', 'badFg'
];

// Valid styles
const VALID_STYLES = [
  'monochrome', 'analogous', 'complementary', 'split-complementary',
  'triadic', 'tetradic', 'compound', 'triadic-split', 'random'
];

// Test functions
async function testGenerateTheme() {
  logSection('1. Testing Generate Theme API');

  // Test 1: Random theme with dual response
  logInfo('Test 1.1: Generate random theme (light + dark)');
  const response1 = await apiRequest('/generate-theme', {
    method: 'POST',
    body: JSON.stringify({ style: 'random' }),
  });

  if (response1 && response1.status === 200) {
    const data = await response1.json();
    if (data.success && data.light && data.dark && data.metadata) {
      const hasAllTokens = EXPECTED_TOKENS.every(token => 
        data.light[token] && data.dark[token]
      );
      if (hasAllTokens) {
        logSuccess('Random theme generated with 20 tokens each');
        logInfo(`  Style: ${data.metadata.style}`);
        logInfo(`  Philosophy: ${data.metadata.philosophy.substring(0, 50)}...`);
      } else {
        logError('Missing tokens in response');
      }
    } else {
      logError('Invalid response structure (expected light, dark, metadata)');
    }
  } else {
    logError(`Failed with status: ${response1?.status}`);
  }

  await delay(500);

  // Test 2: Analogous theme
  logInfo('Test 1.2: Generate analogous theme');
  const response2 = await apiRequest('/generate-theme', {
    method: 'POST',
    body: JSON.stringify({ style: 'analogous' }),
  });

  if (response2 && response2.status === 200) {
    const data = await response2.json();
    if (data.success && data.metadata.style === 'analogous') {
      logSuccess('Analogous theme generated successfully');
    } else {
      logError('Invalid analogous theme response');
    }
  } else {
    logError(`Failed with status: ${response2?.status}`);
  }

  await delay(500);

  // Test 3: Triadic theme
  logInfo('Test 1.3: Generate triadic theme');
  const response3 = await apiRequest('/generate-theme', {
    method: 'POST',
    body: JSON.stringify({ style: 'triadic' }),
  });

  if (response3 && response3.status === 200) {
    const data = await response3.json();
    if (data.success && data.metadata.style === 'triadic') {
      logSuccess('Triadic theme generated successfully');
    } else {
      logError('Invalid triadic theme response');
    }
  } else {
    logError(`Failed with status: ${response3?.status}`);
  }

  await delay(500);

  // Test 4: Theme with base color
  logInfo('Test 1.4: Generate theme with base color');
  const response4 = await apiRequest('/generate-theme', {
    method: 'POST',
    body: JSON.stringify({ 
      style: 'complementary',
      baseColor: '#3B82F6'
    }),
  });

  if (response4 && response4.status === 200) {
    const data = await response4.json();
    if (data.success && data.metadata.seed === '#3B82F6') {
      logSuccess('Theme with base color generated successfully');
    } else {
      logError('Base color not reflected in seed');
    }
  } else {
    logError(`Failed with status: ${response4?.status}`);
  }

  await delay(500);

  // Test 5: With saturation, contrast, brightness
  logInfo('Test 1.5: Generate theme with saturation/contrast/brightness');
  const response5 = await apiRequest('/generate-theme', {
    method: 'POST',
    body: JSON.stringify({ 
      style: 'analogous',
      saturation: 3,
      contrast: 2,
      brightness: -1
    }),
  });

  if (response5 && response5.status === 200) {
    const data = await response5.json();
    if (data.success && data.light && data.dark) {
      logSuccess('Theme with parameters generated successfully');
    } else {
      logError('Invalid theme response');
    }
  } else {
    logError(`Failed with status: ${response5?.status}`);
  }

  await delay(500);

  // Test 6: Invalid style
  logInfo('Test 1.6: Test invalid style (should fail)');
  const response6 = await apiRequest('/generate-theme', {
    method: 'POST',
    body: JSON.stringify({ style: 'invalid-style' }),
  });

  if (response6 && response6.status === 400) {
    const data = await response6.json();
    if (data.code === 'INVALID_STYLE') {
      logSuccess('Invalid style correctly rejected');
    } else {
      logError('Wrong error code for invalid style');
    }
  } else {
    logError(`Expected 400, got: ${response6?.status}`);
  }

  await delay(500);

  // Test 7: Invalid base color
  logInfo('Test 1.7: Test invalid base color (should fail)');
  const response7 = await apiRequest('/generate-theme', {
    method: 'POST',
    body: JSON.stringify({ 
      style: 'random',
      baseColor: 'not-a-color'
    }),
  });

  if (response7 && response7.status === 400) {
    const data = await response7.json();
    if (data.code === 'INVALID_BASE_COLOR') {
      logSuccess('Invalid base color correctly rejected');
    } else {
      logError('Wrong error code for invalid base color');
    }
  } else {
    logError(`Expected 400, got: ${response7?.status}`);
  }

  await delay(500);

  // Test 8: Invalid parameters
  logInfo('Test 1.8: Test out-of-range saturation (should fail)');
  const response8 = await apiRequest('/generate-theme', {
    method: 'POST',
    body: JSON.stringify({ 
      style: 'random',
      saturation: 10  // Out of -5 to 5 range
    }),
  });

  if (response8 && response8.status === 400) {
    const data = await response8.json();
    if (data.code === 'INVALID_PARAMETERS') {
      logSuccess('Out-of-range parameter correctly rejected');
    } else {
      logError('Wrong error code for invalid parameters');
    }
  } else {
    logError(`Expected 400, got: ${response8?.status}`);
  }

  await delay(500);
}

async function testExportTheme() {
  logSection('2. Testing Export Theme API');

  const sampleTheme = {
    bg: '#F8FAFC',
    card: '#F1F5F9',
    card2: '#E2E8F0',
    text: '#0F172A',
    textMuted: '#475569',
    textOnColor: '#FFFFFF',
    primary: '#3B82F6',
    primaryFg: '#FFFFFF',
    secondary: '#6366F1',
    secondaryFg: '#FFFFFF',
    accent: '#F43F5E',
    accentFg: '#FFFFFF',
    border: '#CBD5E1',
    ring: '#3B82F6',
    good: '#10B981',
    goodFg: '#FFFFFF',
    warn: '#F59E0B',
    warnFg: '#000000',
    bad: '#EF4444',
    badFg: '#FFFFFF'
  };

  const formats = ['css', 'scss', 'less', 'tailwind', 'json'];

  for (const format of formats) {
    logInfo(`Test 2.${formats.indexOf(format) + 1}: Export as ${format.toUpperCase()}`);
    
    const response = await apiRequest('/export-theme', {
      method: 'POST',
      body: JSON.stringify({ 
        theme: sampleTheme,
        format
      }),
    });

    if (response && response.status === 200) {
      const data = await response.json();
      if (data.success && data.content && data.filename) {
        logSuccess(`Theme exported as ${format.toUpperCase()}`);
        logInfo(`  Filename: ${data.filename}`);
        logInfo(`  Content length: ${data.content.length} characters`);
      } else {
        logError(`Invalid export response for ${format}`);
      }
    } else {
      logError(`Failed to export as ${format}, status: ${response?.status}`);
    }

    await delay(500);
  }

  // Test custom prefix
  logInfo('Test 2.6: Export with custom prefix');
  const response = await apiRequest('/export-theme', {
    method: 'POST',
    body: JSON.stringify({ 
      theme: sampleTheme,
      format: 'css',
      options: {
        prefix: 'custom'
      }
    }),
  });

  if (response && response.status === 200) {
    const data = await response.json();
    if (data.content.includes('--custom-primary')) {
      logSuccess('Custom prefix applied correctly');
    } else {
      logError('Custom prefix not found in content');
    }
  } else {
    logError(`Failed with status: ${response?.status}`);
  }

  await delay(500);

  // Test invalid format
  logInfo('Test 2.7: Test invalid format (should fail)');
  const response2 = await apiRequest('/export-theme', {
    method: 'POST',
    body: JSON.stringify({ 
      theme: sampleTheme,
      format: 'invalid-format'
    }),
  });

  if (response2 && response2.status === 400) {
    const data = await response2.json();
    if (data.code === 'INVALID_FORMAT') {
      logSuccess('Invalid format correctly rejected');
    } else {
      logError('Wrong error code for invalid format');
    }
  } else {
    logError(`Expected 400, got: ${response2?.status}`);
  }

  await delay(500);
}

async function testThemeHistory() {
  logSection('3. Testing Theme History API');

  // Test 1: Default pagination
  logInfo('Test 3.1: Get history with default pagination');
  const response1 = await apiRequest('/theme-history', {
    method: 'GET',
  });

  if (response1 && response1.status === 200) {
    const data = await response1.json();
    if (data.success && data.pagination && data.pagination.limit === 10) {
      logSuccess('Theme history retrieved with default pagination');
      logInfo(`  Limit: ${data.pagination.limit}, Offset: ${data.pagination.offset}`);
    } else {
      logError('Invalid history response');
    }
  } else {
    logError(`Failed with status: ${response1?.status}`);
  }

  await delay(500);

  // Test 2: Custom limit
  logInfo('Test 3.2: Get history with custom limit');
  const response2 = await apiRequest('/theme-history?limit=20', {
    method: 'GET',
  });

  if (response2 && response2.status === 200) {
    const data = await response2.json();
    if (data.pagination.limit === 20) {
      logSuccess('Custom limit applied correctly');
    } else {
      logError('Custom limit not applied');
    }
  } else {
    logError(`Failed with status: ${response2?.status}`);
  }

  await delay(500);

  // Test 3: Rate limit headers
  logInfo('Test 3.3: Check rate limit headers');
  const response3 = await apiRequest('/theme-history', {
    method: 'GET',
  });

  if (response3) {
    const rateLimitHeader = response3.headers.get('X-RateLimit-Limit');
    const remainingHeader = response3.headers.get('X-RateLimit-Remaining');
    
    if (rateLimitHeader && remainingHeader) {
      logSuccess('Rate limit headers present');
      logInfo(`  Limit: ${rateLimitHeader}, Remaining: ${remainingHeader}`);
    } else {
      logError('Rate limit headers missing');
    }
  }

  await delay(500);
}

async function testCORS() {
  logSection('4. Testing CORS Support');

  logInfo('Test 4.1: Check CORS headers on generate-theme');
  const response = await apiRequest('/generate-theme', {
    method: 'OPTIONS',
  });

  if (response && response.status === 200) {
    const corsOrigin = response.headers.get('Access-Control-Allow-Origin');
    const corsMethods = response.headers.get('Access-Control-Allow-Methods');
    
    if (corsOrigin === '*' && corsMethods) {
      logSuccess('CORS headers correctly configured');
      logInfo(`  Origin: ${corsOrigin}`);
      logInfo(`  Methods: ${corsMethods}`);
    } else {
      logError('CORS headers missing or incorrect');
    }
  } else {
    logError(`OPTIONS request failed with status: ${response?.status}`);
  }

  await delay(500);
}

async function testIntegration() {
  logSection('5. Integration Test - Complete Workflow');

  logInfo('Step 1: Generate a triadic theme');
  const generateResponse = await apiRequest('/generate-theme', {
    method: 'POST',
    body: JSON.stringify({ 
      style: 'triadic',
      baseColor: '#3B82F6',
      saturation: 2
    }),
  });

  if (!generateResponse || generateResponse.status !== 200) {
    logError('Failed to generate theme');
    return;
  }

  const { light, dark, metadata } = await generateResponse.json();
  logSuccess('Theme generated');
  logInfo(`  Style: ${metadata.style}`);
  logInfo(`  Light primary: ${light.primary}`);
  logInfo(`  Dark primary: ${dark.primary}`);

  await delay(500);

  logInfo('Step 2: Export light theme as CSS');
  const exportResponse = await apiRequest('/export-theme', {
    method: 'POST',
    body: JSON.stringify({ 
      theme: light,
      format: 'css',
      options: {
        prefix: 'integration-test',
        includeComments: true
      }
    }),
  });

  if (!exportResponse || exportResponse.status !== 200) {
    logError('Failed to export theme');
    return;
  }

  const { content, filename } = await exportResponse.json();
  logSuccess('Theme exported');
  logInfo(`  Filename: ${filename}`);
  logInfo(`  Content preview: ${content.substring(0, 100)}...`);

  await delay(500);

  logInfo('Step 3: Verify exported content');
  if (content.includes('--integration-test-primary') && 
      content.includes('--integration-test-bg') &&
      content.includes(':root {') &&
      content.includes('}')) {
    logSuccess('Exported content is valid CSS');
  } else {
    logError('Exported content is invalid');
  }

  logSuccess('✨ Complete integration workflow passed!');
}

async function printSummary() {
  logSection('Test Summary');
  
  log(`Total Tests: ${totalTests}`, colors.cyan);
  log(`Passed: ${passedTests}`, colors.green);
  log(`Failed: ${failedTests}`, colors.red);
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  log(`Success Rate: ${successRate}%`, successRate === '100.0' ? colors.green : colors.yellow);
  
  if (failedTests === 0) {
    log('\n🎉 All tests passed!', colors.green);
  } else {
    log(`\n⚠️  ${failedTests} test(s) failed`, colors.red);
  }
}

// Main test runner
async function runAllTests() {
  log('\n🚀 Starting API Test Suite', colors.blue);
  log(`Testing API at: ${API_BASE_URL}\n`, colors.cyan);

  try {
    await testGenerateTheme();
    await testExportTheme();
    await testThemeHistory();
    await testCORS();
    await testIntegration();
    
    await printSummary();
  } catch (error) {
    logError(`\nTest suite error: ${error.message}`);
    console.error(error);
  }
}

// Run tests
runAllTests();
