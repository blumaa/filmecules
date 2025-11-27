import { Badge, Box, Card, Heading, Text } from "@mond-design-system/theme";
import type { Group } from "../../types";
import "./FilmGroupCard.css";
import { useThemeContext } from "../../providers/useThemeContext";
import { getTextLengthProps } from "../../utils";
interface FilmGroupCardProps {
  group: Group;
}

export function FilmGroupCard({ group }: FilmGroupCardProps) {
  const { theme } = useThemeContext();
  return (
    <Card className={`film-group-card ${group.color}`}>
      <Box
        display="flex"
        flexDirection="column"
        gap="xs"
        paddingRight="2"
        paddingLeft="2"
        paddingTop="1"
        paddingBottom="1"
      >
        <Heading
          level={3}
          size="md"
          semantic={theme === "light" ? "primary" : "inverse"}
        >
          {group.connection}
        </Heading>
        <Box display="flex" gap="xxs" flexWrap="wrap">
          {group.films.map((film) => {
            const textLengthProps = getTextLengthProps(film.title);
            return (
              <Badge key={film.id} size="sm">
                <Text responsive {...textLengthProps}>
                  {film.title}
                </Text>
              </Badge>
            );
          })}
        </Box>
      </Box>
    </Card>
  );
}
