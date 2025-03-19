# API Status Tracker

A simple tool to track the status of API submissions.

## Login Variables

The login variables are stored in the `src/lib/auth.tsx` file.

```tsx
const [apiUrl, setApiUrl] = useState("");
const [apiKey, setApiKey] = useState("");
```

## Development

```bash
pnpm install
pnpm run dev
```

## Production

```bash
pnpm run build
pnpm run start
```

## Author

This project is developed by [Evy04](https://github.com/Evy04).
