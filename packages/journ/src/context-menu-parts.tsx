'use client'

import * as RadixMenu from '@radix-ui/react-context-menu'
import { createMenuParts } from './lib/menu-parts'

const Root = RadixMenu.Root
const Trigger = RadixMenu.Trigger
const Group = RadixMenu.Group

const { Content, Item, Label, Separator } = createMenuParts(RadixMenu, 'context-menu')

export { Root, Trigger, Group, Content, Item, Label, Separator }
