---
description: A multi-step checkout in React Native with stacked bottom sheets - cart, address, payment and success - using stack, replace and dismissAll.
---

# Multi-step checkout

Cart → address (stacked on the cart) → payment (replaces the address) → success (replaces everything).

```tsx
import {Button, Text, View} from 'react-native';
import {useNativeSheet} from 'react-native-universal-sheet';

export function CartButton() {
  const sheet = useNativeSheet();
  return (
    <Button
      title="View cart"
      onPress={() => sheet.present({id: 'cart', content: <Cart />, snapPoints: ['60%', '95%']})}
    />
  );
}

function Cart() {
  const sheet = useNativeSheet();
  return (
    <View style={{padding: 20, gap: 12}}>
      <Text style={{fontSize: 20, fontWeight: '600'}}>Your cart</Text>
      {/* items… */}
      <Button
        title="Checkout"
        // Stack: the cart stays underneath, so "back" returns to it.
        onPress={() => sheet.present({id: 'address', content: <Address />, snapPoints: ['content']})}
      />
    </View>
  );
}

function Address() {
  const sheet = useNativeSheet();
  return (
    <View style={{padding: 20, gap: 12}}>
      <Text style={{fontSize: 20, fontWeight: '600'}}>Delivery address</Text>
      <Button
        title="Continue to payment"
        // Replace: the address sheet closes, payment takes its place above the cart.
        onPress={() =>
          sheet.present({id: 'payment', content: <Payment />, presentation: 'replace', snapPoints: ['content']})
        }
      />
    </View>
  );
}

function Payment() {
  const sheet = useNativeSheet();

  const pay = async () => {
    sheet.update('payment', {enableDrag: false, content: <Text style={{padding: 20}}>Processing…</Text>});
    await api.pay();
    sheet.dismissAll();
    sheet.present({id: 'done', variant: 'center', content: <Success />, appearance: {width: 300}});
  };

  return (
    <View style={{padding: 20, gap: 12}}>
      <Text style={{fontSize: 20, fontWeight: '600'}}>Payment</Text>
      <Button title="Pay" onPress={pay} />
    </View>
  );
}

function Success() {
  const sheet = useNativeSheet();
  return (
    <View style={{padding: 24, gap: 12, alignItems: 'center'}}>
      <Text style={{fontSize: 20}}>Order placed 🎉</Text>
      <Button title="Done" onPress={() => sheet.dismiss('done')} />
    </View>
  );
}
```

## What happens to the stack

| Step | Stack (bottom → top) |
| --- | --- |
| View cart | `cart` |
| Checkout | `cart`, `address` |
| Continue to payment | `cart`, `payment` |
| Pay | *(all closing)* → `done` |

While processing, `enableDrag: false` stops the user swiping the payment sheet away.
