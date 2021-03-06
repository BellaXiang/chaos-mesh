import { Box, Chip, TextField, TextFieldProps } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { getIn, useFormikContext } from 'formik'

import Autocomplete from '@material-ui/lab/Autocomplete'
import T from 'components/T'

interface LabelFieldProps {
  isKV?: boolean // whether to use the key:value format,
  errorText?: string
}

const LabelField: React.FC<LabelFieldProps & TextFieldProps> = ({ isKV = false, errorText, ...props }) => {
  const { values, setFieldValue } = useFormikContext()

  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const name = props.name!
  const labels: string[] = getIn(values, name)
  const setLabels = (labels: string[]) => setFieldValue(name, labels)

  useEffect(() => {
    if (errorText) {
      setError(errorText)
    }
  }, [errorText])

  const onChange = (_: any, __: any, reason: string) => {
    if (reason === 'clear') {
      setLabels([])
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    if (val === ' ') {
      setText('')

      return
    }

    setText(e.target.value)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (error) {
      setError('')
    }

    if (e.key === ' ') {
      const t = text.trim()

      if (isKV && !/^[\w-]+:[\w-]+$/.test(t)) {
        setError('Invalid key:value format')

        return
      }

      const duplicate = labels.some((d) => d === t)

      if (!duplicate) {
        setLabels(labels.concat([t]))

        if (error) {
          setError('')
        }
      }

      setText('')
    }

    if (e.key === 'Backspace' && text === '') {
      setLabels(labels.slice(0, labels.length - 1))
    }
  }

  const onDelete = (val: string) => () => setLabels(labels.filter((d: string) => d !== val))

  return (
    <Box mb={3}>
      <Autocomplete
        multiple
        options={labels}
        value={labels}
        open={false} // make popup always closed
        forcePopupIcon={false}
        onChange={onChange}
        inputValue={text}
        renderTags={(value: string[], getTagProps) =>
          value.map((val: string, index: number) => (
            <Chip
              {...getTagProps({ index })}
              style={{ height: 24 }}
              label={val}
              color="primary"
              onDelete={onDelete(val)}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            {...props}
            variant="outlined"
            margin="dense"
            fullWidth
            helperText={error !== '' ? error : isKV ? T('common.isKVHelperText') : props.helperText}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            error={error !== ''}
          />
        )}
      />
    </Box>
  )
}

export default LabelField
