# Groq API Integration Guide

## Overview

Groq API integration for Seventeen Pockets ecosystem with support for:

* Tools and function calling
* RAG (Retrieval-Augmented Generation)
* JSON mode for structured outputs
* Multimodal inputs (text, images, structured data)
* Agentic systems with autonomous decision-making

## Getting Started

### 1. API Key Setup

```bash
# Add to .env
GROQ_API_KEY=your_api_key_here
```

### 2. Installation

```bash
npm install groq-sdk
# or
pip install groq
```

## Features

### Tools & Function Calling

Integrate structured reasoning and external APIs:

```javascript
const Groq = require('groq-sdk');
const client = new Groq();

const tools = [
  {
    type: 'function',
    function: {
      name: 'get_pocket_balance',
      description: 'Get balance for a specific pocket',
      parameters: {
        type: 'object',
        properties: {
          pocket_id: { type: 'string' }
        }
      }
    }
  }
];

const response = await client.chat.completions.create({
  model: 'mixtral-8x7b-32768',
  messages: [{ role: 'user', content: 'What is my savings pocket balance?' }],
  tools: tools
});
```

### RAG Implementation

Combine Groq inference with your knowledge base:

```javascript
const knowledgeBase = [
  'Pocket 01: Identity - User authentication and profiles',
  'Pocket 02: Sync - Real-time data synchronization',
  'Pocket 03: Data - PostgreSQL database with Supabase'
];

const context = knowledgeBase.join('\n');

const response = await client.chat.completions.create({
  model: 'mixtral-8x7b-32768',
  messages: [
    {
      role: 'system',
      content: `You are a Seventeen Pockets assistant. Use this knowledge base:\n${context}`
    },
    { role: 'user', content: 'How does the sync pocket work?' }
  ]
});
```

### JSON Mode

Generate clean, schema-validated JSON outputs:

```javascript
const response = await client.chat.completions.create({
  model: 'mixtral-8x7b-32768',
  messages: [{
    role: 'user',
    content: 'Generate a pocket configuration in JSON format with name, type, and balance fields'
  }],
  response_format: { type: 'json_object' }
});

const pocketConfig = JSON.parse(response.choices[0].message.content);
```

### Multimodal Inputs

Process text, images, and structured data:

```javascript
const response = await client.chat.completions.create({
  model: 'mixtral-8x7b-32768',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Analyze this financial data' },
        { type: 'image_url', image_url: { url: 'https://...' } },
        { type: 'text', text: 'Provide insights in JSON format' }
      ]
    }
  ]
});
```

### Agentic Systems

Orchestrate autonomous agents with decision-making:

```javascript
class PocketAgent {
  constructor(client) {
    this.client = client;
    this.tools = this.definePocketTools();
  }

  definePocketTools() {
    return [
      {
        type: 'function',
        function: {
          name: 'create_pocket',
          description: 'Create a new pocket',
          parameters: { /* ... */ }
        }
      },
      {
        type: 'function',
        function: {
          name: 'transfer_funds',
          description: 'Transfer funds between pockets',
          parameters: { /* ... */ }
        }
      }
    ];
  }

  async executeTask(userRequest) {
    let messages = [{ role: 'user', content: userRequest }];
    
    while (true) {
      const response = await this.client.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: messages,
        tools: this.tools
      });

      const choice = response.choices[0];
      
      if (choice.finish_reason === 'tool_calls') {
        // Process tool calls and continue
        messages.push({ role: 'assistant', content: choice.message.content });
        // Execute tools and add results
      } else {
        return choice.message.content;
      }
    }
  }
}
```

## Integration with Seventeen Pockets

### Pocket 01: Identity

* Use Groq for intelligent user profile analysis
* Function calling for auth operations

### Pocket 02: Sync

* RAG for real-time data context
* Agentic systems for sync orchestration

### Pocket 03: Data

* JSON mode for database queries
* Multimodal analysis of financial data

### Pocket 04+: Future Pockets

* Extend with domain-specific tools
* Build autonomous workflows

## API Cookbook Examples

Ready-to-run examples available at: https://console.groq.com/docs/cookbook

## Performance Tips

* Use `mixtral-8x7b-32768` for balanced performance
* Implement caching for RAG contexts
* Batch tool calls when possible
* Monitor token usage for cost optimization

## Error Handling

```javascript
try {
  const response = await client.chat.completions.create({
    model: 'mixtral-8x7b-32768',
    messages: messages,
    tools: tools
  });
} catch (error) {
  if (error.status === 429) {
    console.log('Rate limited, retrying...');
  } else if (error.status === 401) {
    console.log('Invalid API key');
  }
}
```

## Next Steps

1. Set up Groq API key
2. Implement tools for pocket operations
3. Build RAG system with pocket knowledge base
4. Create agentic workflows
5. Deploy to production

## Resources

* [Groq Console](https://console.groq.com)
* [API Documentation](https://console.groq.com/docs/api)
* [API Cookbook](https://console.groq.com/docs/cookbook)
* [GitHub Examples](https://github.com/groq/groq-api-cookbook)
