# sc.notifier

**NOT OFICIAL** way of syncing with your streamcraft.com account for any project.

## Example

```js
const { Client } = require("../");
const instance = new Client({
  interval: 10000, // Interval for notification verify.
});

instance.on("streaming", stream => {
  console.log('Someone started streaming!', stream);
});

# instance.follow
# instance.unfollow

instance.login({
  email: 'email@email.com',
  password: 'password',
});
```
