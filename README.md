# Data Picker
A simple type-checking data validator and extractor.

The DataPicker class wraps an unknown object (e.g. from user input) and lets 
the user safely get values from it, ensuring that the returned values are 
of the correct type.

### Usage Example
```typescript
import DataPicker from 'data-picker';

let env = new DataPicker('process.env', process.env);

env.getString('NODE_ENV');
```
