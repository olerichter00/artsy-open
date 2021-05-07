# Artsy Open

Open Artsy URLS on you iOS or Android emulator.

Devices: `ios` (default), `android`, `web`
Environment: `staging` (default), `local`, `production`

## Example Usage

List all URL aliases:

```
artsy-open list
```

Open URL with alias (using default variables)

```
artsy-open artwork
```

Open URL with alias (using custom variables):

```
artsy-open artwork artworkID:banksy
```

Open URL:

```
artsy-open /artist/andy-warhol/artist-series
```

Open full URL:

```
artsy-open https://staging.artsy.net/artwork/banksy
```

Open on Android:

```
artsy-open artist android
```

Open on localhost:

```
artsy-open artist web localhost
```
