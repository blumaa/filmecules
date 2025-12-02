import { Box, Text, Link } from "@mond-design-system/theme";
import { SITE_NAME } from "../constants";
import "./Footer.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Box display="flex" alignItems="center" justifyContent="center" paddingBottom="2" paddingTop="2" gap="xxs">
        <Text size="2xs" semantic="secondary">
          © {currentYear} {SITE_NAME}
        </Text>
        <Text size="2xs" semantic="secondary">
          |
        </Text>
        <Link href="/about" target="_blank" rel="noopener noreferrer">
          <Text size="2xs" semantic="secondary">
            About
          </Text>
        </Link>
        <Text size="2xs" semantic="secondary">
          |
        </Text>
        <Link href="/privacy" target="_blank" rel="noopener noreferrer">
          <Text size="2xs" semantic="secondary">
            Privacy
          </Text>
        </Link>
      </Box>
    </footer>
  );
}
