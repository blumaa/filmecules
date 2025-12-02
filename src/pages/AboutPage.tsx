import {
  Box,
  Text,
  Link,
  Button,
  Card,
  CardBody,
  Heading,
} from "@mond-design-system/theme";
import { Link as RouterLink } from "react-router-dom";
import { SITE_NAME } from "../constants";
import "./AboutPage.css";

export function AboutPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="md"
      paddingRight="4"
      paddingLeft="4"
    >
      <Heading size="xl" responsive>
        About {SITE_NAME}
      </Heading>

      <Card variant="elevated" maxWidth="lg">
        <CardBody>
          <Box display="flex" gap="md" flexDirection="column">
            <Text size="sm">
              {SITE_NAME} is a daily music puzzle game. Find the hidden
              connections between songs!
            </Text>

            <Box gap="xxs" display="flex">
              <Text size="sm">Built with the</Text>
              <Link
                size="small"
                href="https://github.com/blumaa/mond-design-system"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mond Design System
              </Link>
            </Box>

            <Box>
              <Heading size="md" weight="semibold" responsive>
                Questions, feedback, or just want to say hi?
              </Heading>
            </Box>
            <Box>
              <Button
                variant="outline"
                size="sm"
                as="a"
                href="mailto:blumaa@gmail.com"
              >
                blumaa@gmail.com
              </Button>
            </Box>
          </Box>
        </CardBody>
      </Card>

      <Box paddingTop="2">
        <RouterLink to="/" className="about-back-link">
          <Button>Back to Game</Button>
        </RouterLink>
      </Box>
    </Box>
  );
}
