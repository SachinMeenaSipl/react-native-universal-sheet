---
description: Build a React Native filter and sort bottom sheet with two snap points, local state and an Apply button using react-native-universal-sheet.
---

# Filter sheet

A product list with a **Filters** button. The sheet opens at 50%, can be dragged to 90%, and applies the filters when the user taps **Apply**.

<div class="preview-row">
  <SheetPreview variant="filter" :snap="0.5" caption="Opens at 50%" />
  <SheetPreview variant="filter" :snap="0.9" caption="Dragged to 90%" />
</div>

```tsx
import {useState} from 'react';
import {Button, FlatList, Pressable, Switch, Text, View} from 'react-native';
import {NativeSheet} from 'react-native-universal-sheet';

type Filters = {inStock: boolean; sort: 'price' | 'rating'};

export function ProductsScreen() {
  const [filters, setFilters] = useState<Filters>({inStock: false, sort: 'price'});
  const [open, setOpen] = useState(false);

  return (
    <View style={{flex: 1}}>
      <Button title="Filters" onPress={() => setOpen(true)} />
      <ProductList filters={filters} />

      <NativeSheet
        visible={open}
        variant="filter"
        snapPoints={['50%', '90%']}
        accessibilityLabel="Filters"
        styles={{contentStyle: {padding: 20, gap: 16}}}
        onDismiss={() => setOpen(false)}>
        <FilterForm
          initial={filters}
          onApply={next => {
            setFilters(next);
            setOpen(false);
          }}
        />
      </NativeSheet>
    </View>
  );
}

function FilterForm({initial, onApply}: {initial: Filters; onApply: (f: Filters) => void}) {
  // Draft state lives in the sheet, so swiping away discards changes.
  const [draft, setDraft] = useState(initial);

  return (
    <>
      <Text style={{fontSize: 20, fontWeight: '600'}}>Filters</Text>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text>In stock only</Text>
        <Switch value={draft.inStock} onValueChange={inStock => setDraft({...draft, inStock})} />
      </View>

      <Text style={{fontWeight: '600'}}>Sort by</Text>
      {(['price', 'rating'] as const).map(sort => (
        <Pressable key={sort} onPress={() => setDraft({...draft, sort})}>
          <Text>{draft.sort === sort ? '● ' : '○ '}{sort}</Text>
        </Pressable>
      ))}

      <Button title="Apply" onPress={() => onApply(draft)} />
    </>
  );
}

function ProductList({filters}: {filters: Filters}) {
  return <FlatList data={[]} renderItem={null} ListEmptyComponent={<Text>{JSON.stringify(filters)}</Text>} />;
}
```

## Variations

**Keep the list usable while the panel is open**: add `behavior="nonModal"`. The backdrop is removed and the list behind stays scrollable.

**Apply on every change**: call `setFilters` directly from the form instead of keeping a draft.
