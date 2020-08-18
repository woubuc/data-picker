# Data Picker
A simple type-checking data validator and extractor.

The DataPicker class wraps an unknown object (e.g. from user input) and lets 
the user safely get values from it, ensuring that the returned values are 
of the correct type.

### Usage Example
```typescript
import DataPicker from 'data-picker';

let env = new DataPicker('process.env', process.env);

// Returns the env 'NODE_ENV', or 'development' if the env doesn't exist
let node_env = env.getString('NODE_ENV', 'development');

// node_env is now guaranteed to contain a string
```
