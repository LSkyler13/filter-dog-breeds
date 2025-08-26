# filterBreeds.js

A tiny Node.js script that fetches the Dog CEO breed list and prints breeds starting with a given **single letter** (default: `b`). Sub-breeds are shown in parentheses.

## Requirements
- Node.js **18+** (uses built-in `fetch`)
- Internet access (Dog CEO API)

## Setup
1. Add `filterBreeds.js` to your project.
2. (Optional) Make it executable on macOS/Linux:
   ```bash
   chmod +x filterBreeds.js
## Usage
### Default: breeds starting with "b"
node filterBreeds.js

### Specify a letter (A–Z)
node filterBreeds.js m

### If made executable:
./filterBreeds.js m

### Example Output
1. Basenji
2. Beagle
3. Bulldog (sub-breeds: Boston, English, French)
...
