import { Box, Text, Link } from "@mond-design-system/theme";
import { Link as RouterLink } from "react-router-dom";
import { SITE_NAME } from "../constants";
import "./PrivacyPage.css";

export function PrivacyPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="4"
      gap="md"
      className="privacy-page"
    >
      <Text size="xl" weight="bold">
        Privacy Policy
      </Text>
      <Text size="xs" semantic="secondary">
        Last updated: December 2024
      </Text>

      <Box display="flex" flexDirection="column" gap="sm" className="privacy-content">
        <Text size="md" weight="semibold">
          What We Collect
        </Text>
        <Text size="sm">
          We use Amplitude, a third-party analytics service, to understand how people use {SITE_NAME}.
          This helps us improve the game. Amplitude automatically collects:
        </Text>
        <ul className="privacy-list">
          <li><Text size="sm">Device type and browser information</Text></li>
          <li><Text size="sm">General location (country/region, not precise location)</Text></li>
          <li><Text size="sm">Game interactions (games played, wins, streaks)</Text></li>
          <li><Text size="sm">Anonymous usage patterns</Text></li>
        </ul>

        <Box paddingTop="2">
          <Text size="md" weight="semibold">
            What We Don't Collect
          </Text>
        </Box>
        <ul className="privacy-list">
          <li><Text size="sm">Your name or email (unless you contact us)</Text></li>
          <li><Text size="sm">Precise location data</Text></li>
          <li><Text size="sm">Any information you don't voluntarily provide</Text></li>
        </ul>

        <Box paddingTop="2">
          <Text size="md" weight="semibold">
            Local Storage
          </Text>
        </Box>
        <Text size="sm">
          Your game progress and statistics are stored locally in your browser.
          This data never leaves your device unless you choose to share it.
        </Text>

        <Box paddingTop="2">
          <Text size="md" weight="semibold">
            Third-Party Services
          </Text>
        </Box>
        <Text size="sm">
          We use <Link href="https://amplitude.com/privacy" target="_blank" rel="noopener noreferrer">Amplitude</Link> for
          analytics. Their privacy policy explains how they handle data.
        </Text>

        <Box paddingTop="2">
          <Text size="md" weight="semibold">
            Your Rights
          </Text>
        </Box>
        <Text size="sm">
          Analytics data is anonymized and cannot be traced back to you personally.
          If you have questions or concerns, contact us at{" "}
          <Link href="mailto:blumaa@gmail.com">blumaa@gmail.com</Link>.
        </Text>

        <Box paddingTop="2">
          <Text size="md" weight="semibold">
            Changes
          </Text>
        </Box>
        <Text size="sm">
          We may update this policy occasionally. Check back for the latest version.
        </Text>
      </Box>

      <Box paddingTop="2">
        <RouterLink to="/" className="privacy-back-link">
          <Text size="sm" semantic="primary">
            Back to Game
          </Text>
        </RouterLink>
      </Box>
    </Box>
  );
}
