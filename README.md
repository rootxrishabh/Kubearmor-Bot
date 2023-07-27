# kubearmor-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that has the functionality listed below.

## Functionalities

1) Automatically assign the PR to be reviewed by atleast one of the maintainers (can be taken from suggested reviewers)

2) Basic checks - Whether DCO check is passed, if it's failing go-lint, go-sec or any other test and comment with asking the contributor to kindly address these. But this warning should be given only     once and after some time interval threshold (after maybe 15 min of failing the test) because many a times it's a developing PR. (TO BE IMPLEMENTED)

3) Mark a PR as stale after some time of inactivity 45 day.


## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t kubearmor-bot .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> kubearmor-bot
```

## Contributing

If you have suggestions for how kubearmor-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2023 Rishabh Soni
