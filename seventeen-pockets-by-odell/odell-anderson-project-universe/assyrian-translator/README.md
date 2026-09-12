# Old Assyrian to English Translator

A comprehensive translation system for Old Assyrian (ancient Akkadian dialect) to English, featuring linguistic analysis, contextual information, and historical examples.

## Features

* **Word Translation**: Translate individual Old Assyrian words with full linguistic metadata
* **Phrase Translation**: Translate phrases with word-by-word breakdown and confidence scoring
* **Linguistic Analysis**: Detailed analysis including etymology, part of speech, and context
* **Category Search**: Find words by semantic category (commerce, family, government, etc.)
* **Pattern Matching**: Search for words using wildcard patterns
* **Similarity Matching**: Get suggestions for misspelled or unknown words
* **Dictionary Statistics**: View comprehensive statistics about the dictionary
* **Caching**: Optimized performance with translation caching

## Installation

```bash
cd assyrian-translator
npm install
```

## Usage

### Basic Translation

```javascript
import AssyrianTranslator from './src/translator.js';

const translator = new AssyrianTranslator();

// Translate a single word
const result = translator.translate('šarru');
console.log(result.translation); // "king, ruler"
```

### Phrase Translation

```javascript
const phrase = translator.translatePhrase('šarru rabû');
console.log(phrase.simpleTranslation); // "king great"
console.log(phrase.confidence); // 100
```

### Detailed Analysis

```javascript
const analysis = translator.analyze('tamkāru');
console.log(analysis.etymology); // "Akkadian tamkāru"
console.log(analysis.context); // "commerce"
```

### Search by Category

```javascript
const commerceWords = translator.findByCategory('commerce');
commerceWords.forEach(word => {
  console.log(`${word.word}: ${word.translation}`);
});
```

### Pattern Search

```javascript
const results = translator.search('^š.*'); // Words starting with š
results.forEach(word => {
  console.log(`${word.word}: ${word.translation}`);
});
```

### Get Available Categories

```javascript
const categories = translator.getCategories();
console.log(categories);
// ['commerce', 'family', 'government', 'nature', 'religion', ...]
```

### Dictionary Statistics

```javascript
const stats = translator.getStatistics();
console.log(`Total words: ${stats.totalWords}`);
console.log(stats.partOfSpeech);
```

## Running Examples

```bash
npm start
```

## Running Tests

```bash
npm test
```

## Dictionary Structure

Each dictionary entry contains:

* **translation**: English translation
* **partOfSpeech**: noun, verb, adjective, number, proper noun
* **etymology**: Historical origin and related words
* **context**: Semantic category (commerce, family, government, etc.)
* **example**: Usage example in Old Assyrian

## Dictionary Categories

* **Greetings & Social**: Social interactions and relationships
* **Commerce & Trade**: Merchant terminology and business
* **Family & Kinship**: Family relationships
* **Government & Administration**: Political and administrative terms
* **Religion & Spirituality**: Religious and mythological terms
* **Actions & Verbs**: Common verbs and actions
* **Adjectives & Descriptors**: Descriptive words
* **Numbers & Quantities**: Numerical terms
* **Time & Duration**: Time-related words
* **Nature & Geography**: Geographic and natural features

## API Reference

### `translate(word)`

Translate a single Old Assyrian word.

**Returns**: Object with translation, part of speech, etymology, context, and example.

### `translatePhrase(phrase)`

Translate a phrase with word-by-word breakdown.

**Returns**: Object with simple translation, word-by-word breakdown, and confidence score.

### `analyze(word)`

Get detailed linguistic analysis of a word.

**Returns**: Object with translation, etymology, part of speech, context, and character analysis.

### `findByCategory(category)`

Find all words in a specific category.

**Returns**: Array of words with translations.

### `getCategories()`

Get all available semantic categories.

**Returns**: Sorted array of category names.

### `search(pattern)`

Search for words matching a pattern (supports wildcards).

**Returns**: Array of matching words.

### `getStatistics()`

Get dictionary statistics.

**Returns**: Object with total words, part of speech counts, and context counts.

### `clearCache()`

Clear the translation cache.

## Historical Context

Old Assyrian refers to the Akkadian dialect used in ancient Assyria (c. 2600-2025 BCE). This translator focuses on vocabulary from merchant texts, administrative documents, and religious inscriptions from this period.

The dictionary is based on:

* Cuneiform text analysis
* Scholarly linguistic research
* Historical merchant records
* Religious and administrative documents

## Limitations

* Dictionary contains \~100 core vocabulary items
* Focuses on frequently used words in historical texts
* Does not include complete grammatical conjugations
* Transliterations use standard Assyriology conventions

## Future Enhancements

* Expand dictionary with additional vocabulary
* Add grammatical conjugation support
* Implement cuneiform character recognition
* Add audio pronunciation guides
* Create interactive learning mode
* Support for other ancient languages

## License

MIT

## Author

Shippedout
