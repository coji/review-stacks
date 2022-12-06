import { Stack, Box, Heading, Switch } from '@chakra-ui/react'

interface ReviewStacksTitleProps {
  title: string
  updatedAt: string
  isShowMerged: boolean
  onToggleShowMerged: (val: boolean) => void
}
export const ReviewStacksTitle = ({
  title,
  updatedAt,
  isShowMerged,
  onToggleShowMerged
}: ReviewStacksTitleProps) => (
  <Stack direction="row">
    <Box flex="1">
      <Heading color="gray.600" size="sm">
        <Box>{title}</Box>
      </Heading>
      <Box fontSize="xs" color="gray.500">
        最終更新: {updatedAt}
      </Box>
    </Box>

    <Box textAlign="right" fontSize="sm">
      <Switch
        isChecked={isShowMerged}
        onChange={() => onToggleShowMerged(!isShowMerged)}
      >
        最近のマージ済みも表示
      </Switch>
    </Box>
  </Stack>
)
