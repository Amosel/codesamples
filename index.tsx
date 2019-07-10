import React, { Component } from 'react'
import { Root } from './navigation'
import { StoreProvider } from './store/store.context'
import { ActionOSheetProvider } from './components/ActionSheetProvider'
export function App() {
  return (
    <StoreProvider>
      <ActionOSheetProvider>
        <Root />
      </ActionOSheetProvider>
    </StoreProvider>
  )
}
