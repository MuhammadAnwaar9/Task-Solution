import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { anwaarDev } from '../assets/images/imagesListing';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
const ProfileScreen = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';

  const colors = {
    bg: isDark ? '#0B1220' : '#EFEFF4',
    card: isDark ? '#14213A' : '#FFFFFF',
    text: isDark ? '#F9F9F9' : '#1A1A1A',
    subText: isDark ? '#999' : '#555',
    primary: '#007AFF',
    border: isDark ? '#22314D' : '#E2E2E2',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarRing}>
            <Image source={anwaarDev} style={styles.avatar} />
          </View>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>Anwaar Dev</Text>
        <Text style={[styles.email, { color: colors.subText }]}>
          anwaardev9@email.com
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.editButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.settingsCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Preferences
        </Text>
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, { color: colors.text }]}>
            Dark Mode
          </Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    marginBottom: 30,
    marginTop: hp(8),
  },
  avatarWrapper: {
    marginBottom: 14,
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
