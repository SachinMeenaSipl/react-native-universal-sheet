import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {SheetManager} from './SheetManager';
import type {SheetAction, SheetAppearance, SheetResult, SheetStyles} from './types';

export interface AlertOptions {
  id: string;
  title: string;
  message?: string;
  actions?: SheetAction[];
  /** Surface design: colours, radius, border, shadow, width. */
  appearance?: SheetAppearance;
  /** Style overrides for the title, message, buttons and wrapper. */
  styles?: SheetStyles;
}

function AlertContent({
  manager,
  id,
  title,
  message,
  actions,
  styles,
}: AlertOptions & {manager: SheetManager}) {
  const buttons = actions && actions.length > 0 ? actions : [{label: 'OK'}];
  return (
    <View style={[defaults.body, styles?.contentStyle]}>
      <Text style={[defaults.title, styles?.titleStyle]}>{title}</Text>
      {message ? <Text style={[defaults.message, styles?.messageStyle]}>{message}</Text> : null}
      {buttons.map(action => (
        <Pressable
          key={action.label}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={[defaults.button, styles?.buttonStyle]}
          onPress={() => {
            manager.dismiss(id);
            action.onPress?.();
          }}>
          <Text
            style={[
              defaults.buttonText,
              action.style === 'destructive' ? defaults.destructive : null,
              styles?.buttonTextStyle,
            ]}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/** Presents an alert dialog: title, message and action buttons. Tapping any action dismisses it. */
export function presentAlert(manager: SheetManager, options: AlertOptions): SheetResult {
  return manager.present({
    id: options.id,
    variant: 'alert',
    appearance: options.appearance,
    styles: options.styles,
    content: <AlertContent manager={manager} {...options} />,
    accessibilityLabel: options.title,
  });
}

export interface ToastOptions {
  id: string;
  message: string;
  /** Overrides the variant's default duration. */
  durationMs?: number;
  appearance?: SheetAppearance;
  styles?: SheetStyles;
}

/** Presents a short auto-dismissing message at the bottom of the screen. */
export function presentToast(manager: SheetManager, options: ToastOptions): SheetResult {
  return manager.present({
    id: options.id,
    variant: 'toast',
    autoDismissMs: options.durationMs,
    appearance: options.appearance,
    styles: options.styles,
    content: (
      <View style={[defaults.toast, options.styles?.contentStyle]}>
        <Text style={[defaults.toastText, options.styles?.messageStyle]}>{options.message}</Text>
      </View>
    ),
    accessibilityLabel: options.message,
  });
}

/** Default look for presets. Every value can be overridden through `styles` and `appearance`. */
const defaults = StyleSheet.create({
  body: {padding: 20, gap: 12},
  title: {fontSize: 18, fontWeight: '600', color: '#111'},
  message: {fontSize: 15, color: '#444'},
  button: {paddingVertical: 12, alignItems: 'center'},
  buttonText: {fontSize: 16, color: '#0a62d6'},
  destructive: {color: '#d62c2c'},
  toast: {padding: 14, borderRadius: 10, backgroundColor: '#222'},
  toastText: {color: '#fff', fontSize: 15},
});
