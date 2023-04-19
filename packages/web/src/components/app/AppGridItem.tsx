import { ContextMenu } from '@appser/ui'
import { Flex, Popover, ThemeIcon, createStyles } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClickOutside } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import EditableText from 'web/components/common/EditableText'
import { IconApp } from 'web/components/icons/IconApp'
import { useDeleteApp } from 'web/servers/app/useDeleteApp'
import { useUpdateApp } from 'web/servers/app/useUpdateApp'

import { AppStylePanel } from './AppStylePanel'
import { openAlertDialog } from '../modals/alertDialog'

import type { FlexProps } from '@mantine/core'
import type { TApp } from 'web/servers/app/types'

interface AppItemProps extends FlexProps {
  app: Pick<TApp, 'id' | 'name' | 'tintColor' | 'icon'>
}

const ITEM_WIDTH = 120

const useStyles = createStyles((theme) => ({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: ITEM_WIDTH,
    userSelect: 'none'
  },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    fontSize: theme.fontSizes.sm,
    borderRadius: theme.radius.sm,
    borderColor: 'transparent',
    borderWidth: 2,
    padding: '0 3px'
  }
}))

export const AppGridItem = ({ app, className, ...rest }: AppItemProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { classes, cx } = useStyles()
  const [isActive, setIsActive] = useState(false)
  const [isEditTitle, setIsEditTitle] = useState(false)
  const [showTheme, setShowTheme] = useState(false)
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const deleteApp = useDeleteApp()
  const updateApp = useUpdateApp()
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null)
  const [item, setItem] = useState<HTMLDivElement | null>(null)
  const itemOutsideClick = useRef(false)
  const form = useForm({
    initialValues: {
      name: app.name ?? t('component.AppItem.untitled') as string,
      tintColor: app.tintColor,
      icon: app.icon
    }
  })

  useClickOutside(() => {
    if (showTheme || isMenuOpened) {
      itemOutsideClick.current = true

      return
    }

    setIsActive(false)
  }, null, [dropdown, item])

  const gotoApp = () => {
    if (isEditTitle || showTheme) return
    navigate(`/apps/${app.id}`)
  }

  const onEditTitle = () => {
    setIsActive(true)
    setIsEditTitle(true)
  }

  const confirmDeleteApp = () => {
    openAlertDialog({
      title: t('modal.confirmDeleteApp.title'),
      buttons: [
        {
          label: t('modal.button.cancel'),
          type: 'cancel',
          onClick: () => {}
        },
        {
          label: t('modal.button.delete'),
          type: 'destructive',
          onClick: (close) => {
            deleteApp.mutate({ appId: app.id })
            close()
          }
        }
      ]
    })
  }

  useEffect(() => {
    if (form.isDirty()) {
      updateApp.mutate({
        appId: app.id,
        requestBody: form.values as any
      })
    }
  }, [form.values])

  return (
    <ContextMenu
      onClose={() => {
        setIsMenuOpened(false)

        if (itemOutsideClick.current) setIsActive(false)
      }}
    >
      <ContextMenu.Target>
        <Flex
          onContextMenu={() => {
            itemOutsideClick.current = false
            setIsActive(true)
            setShowTheme(false)
            setIsMenuOpened(true)
          }}
          ref={setItem}
          className={cx(classes.container, className)}
          onMouseDown={() => setIsActive(true)}
          onDoubleClick={gotoApp}
          {...rest}
        >
          <Popover
            onClose={() => {
              setIsActive(false)
              setShowTheme(false)
            }}
            width={380}
            opened={showTheme}
          >
            <Popover.Target>
              <ThemeIcon
                radius="md"
                size={ITEM_WIDTH}
                mb='xs'
                color={form.values.tintColor}
                sx={theme => ({
                  borderWidth: 4,
                  borderColor: isActive ? theme.fn.primaryColor(theme.colorScheme) : theme.colorScheme === 'light' ? 'white' : theme.colors.dark[4],
                  color: 'white',
                  boxShadow: theme.shadows.sm
                })}
              >
                <IconApp id={form.values.icon} />
              </ThemeIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <AppStylePanel
                defaultStyle={{ icon: app.icon, tintColor: app.tintColor }}
                onChange={v => {
                  form.setValues(v)
                }}
              />
            </Popover.Dropdown>
          </Popover>

          <EditableText
            isEditable={isEditTitle}
            onCancel={() => setIsEditTitle(false)}
            onConfirm={v => {
              form.setValues({ name: v })
              setIsEditTitle(false)
            }}
            classNames={{ text: classes.title }}
            styles={theme => ({
              root: {
                textAlign: 'center'
              },
              text: {
                backgroundColor: isActive && !isEditTitle ? theme.fn.primaryColor(theme.colorScheme) : 'transparent',
                color: isActive && !isEditTitle ? theme.white : 'inherit'
              },
              input: {
                textAlign: 'center'
              }
            })}
          >
            {form.values.name}
          </EditableText>
        </Flex>
      </ContextMenu.Target>
      <div style={{ position: 'absolute' }} ref={setDropdown}>
        <ContextMenu.Dropdown>
          <ContextMenu.Item>Open</ContextMenu.Item>
          <ContextMenu.Divider mx="xs" />
          <ContextMenu.Item onClick={onEditTitle}>Rename</ContextMenu.Item>
          <ContextMenu.Item onClick={() => setShowTheme(true)}>Change Styles...</ContextMenu.Item>
          <ContextMenu.Divider mx="xs" />
          <ContextMenu.Item color="red" onClick={() => confirmDeleteApp()}>Delete</ContextMenu.Item>
        </ContextMenu.Dropdown>
      </div>
    </ContextMenu>
  )
}
