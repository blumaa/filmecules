import { Box, Heading, Text } from "@mond-design-system/theme";
import { SITE_NAME } from "../../constants";
import { formatPuzzleHeader } from "../../utils/index";
import { CountdownTimer } from "./CountdownTimer";
import "./GameHeader.css";

interface GameHeaderProps {
  gameStatus: "playing" | "won" | "lost";
  puzzleDate?: string; // YYYY-MM-DD format
}

export function GameHeader({
  gameStatus,
  puzzleDate,
}: GameHeaderProps) {
  return (
    <Box display="flex" flexDirection="column">
      <Heading level={1} size="md" align="center">
        {puzzleDate ? formatPuzzleHeader(puzzleDate) : SITE_NAME}
      </Heading>

      {gameStatus === "playing" ? (
        <Text align="center" size="xs">
          Create four groups of four!
        </Text>
      ) : (
        <CountdownTimer />
      )}
    </Box>
  );
}
