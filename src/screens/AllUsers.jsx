/* eslint-disable react-native/no-inline-styles */
import React, { useMemo, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const lightColors = {
  bg: '#F6F8FC',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  text2: '#6B7280',
  muted: '#9CA3AF',
  inputBg: '#FFFFFF',
  chipBg: '#F3F4F6',
  chipBorder: '#E5E7EB',
  primaryBg: '#EEF2FF',
  primaryBorder: '#C7D2FE',
  primaryText: '#3730A3',
  dangerBg: '#FEF2F2',
  dangerBorder: '#FECACA',
  dangerText: '#991B1B',
  sheetBg: '#FFFFFF',
  sheetOverlay: 'rgba(17, 24, 39, 0.55)',
  sectionBg: '#F8FAFC',
  btnBg: '#111827',
  btnText: '#FFFFFF',
};

const darkColors = {
  bg: '#0B1220',
  surface: '#0F1A2E',
  border: '#22314D',
  text: '#EAF0FF',
  text2: '#A9B6D3',
  muted: '#7F8EAC',
  inputBg: '#0F1A2E',
  chipBg: '#14213A',
  chipBorder: '#22314D',
  primaryBg: '#1A2342',
  primaryBorder: '#2B3B6A',
  primaryText: '#BFD0FF',
  dangerBg: '#32181A',
  dangerBorder: '#5B2A2F',
  dangerText: '#FFB4B8',
  sheetBg: '#0F1A2E',
  sheetOverlay: 'rgba(0, 0, 0, 0.65)',
  sectionBg: '#0D172A',
  btnBg: '#EAF0FF',
  btnText: '#0B1220',
};

const fetchUsers = async ({ signal }) => {
  const res = await axios.get('https://dummyjson.com/users?limit=50', {
    signal,
  });
  return res.data;
};

const AllUsers = ({ theme = 'light' }) => {
  const colors = theme === 'dark' ? darkColors : lightColors;

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, isLoading, isFetching, isRefetching, error, refetch } =
    useQuery({
      queryKey: ['users', 50],
      queryFn: fetchUsers,
      staleTime: 60_000,
      retry: 1,
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const users = data?.users ?? [];
  const total = data?.total ?? users.length;

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => {
      const fullName = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
      const email = (u.email ?? '').toLowerCase();
      const phone = (u.phone ?? '').toLowerCase();
      const username = (u.username ?? '').toLowerCase();
      const city = (u.address?.city ?? '').toLowerCase();
      const company = (u.company?.name ?? '').toLowerCase();
      return (
        fullName.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        username.includes(q) ||
        city.includes(q) ||
        company.includes(q)
      );
    });
  }, [users, search]);

  const openUser = useCallback(user => setSelectedUser(user), []);
  const closeUser = useCallback(() => setSelectedUser(null), []);
  const onRefresh = useCallback(() => refetch(), [refetch]);

  const styles = useMemo(() => makeStyles(colors), [colors]);

  const renderUserCard = ({ item }) => {
    const fullName = `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim();
    const subtitle = [item.company?.title, item.company?.name]
      .filter(Boolean)
      .join(' • ');
    const location = [
      item.address?.city,
      item.address?.stateCode || item.address?.state,
      item.address?.country,
    ]
      .filter(Boolean)
      .join(', ');

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => openUser(item)}
        style={styles.card}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.avatar}
          resizeMode="cover"
        />

        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.name} numberOfLines={1}>
              {fullName || 'Unknown'}
            </Text>

            <View style={styles.chipsRow}>
              {!!item.gender && (
                <View style={[styles.chip, styles.chipNeutral]}>
                  <Text style={styles.chipText}>
                    {String(item.gender).toUpperCase()}
                  </Text>
                </View>
              )}
              {typeof item.age === 'number' && (
                <View style={[styles.chip, styles.chipPrimary]}>
                  <Text style={[styles.chipText, styles.chipTextPrimary]}>
                    {item.age}y
                  </Text>
                </View>
              )}
            </View>
          </View>

          {!!item.username && (
            <Text style={styles.meta} numberOfLines={1}>
              @{item.username}
            </Text>
          )}

          <View style={styles.infoRow}>
            {!!item.email && (
              <Text style={styles.info} numberOfLines={1}>
                {item.email}
              </Text>
            )}
            {!!item.phone && <Text style={styles.dot}>•</Text>}
            {!!item.phone && (
              <Text style={styles.info} numberOfLines={1}>
                {item.phone}
              </Text>
            )}
          </View>

          {!!subtitle && (
            <Text style={styles.sub} numberOfLines={1}>
              {subtitle}
            </Text>
          )}

          {!!location && (
            <Text style={styles.location} numberOfLines={1}>
              {location}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>All Users</Text>
            <Text style={styles.subtitle}>
              {isLoading ? 'Loading…' : `${filteredUsers.length} of ${total}`}
              {isFetching && !isLoading ? ' • Updating…' : ''}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onRefresh}
            activeOpacity={0.85}
            style={styles.refreshBtn}
          >
            {isRefetching ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.refreshText}>Refresh</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search name, email, phone, city, company…"
            placeholderTextColor={colors.muted}
            style={styles.search}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={styles.centerText}>Fetching users…</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorTitle}>Could not load users</Text>
            <Text style={styles.errorText}>
              {error?.message ? String(error.message) : 'Unknown error'}
            </Text>
            <TouchableOpacity
              onPress={onRefresh}
              style={styles.retryBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredUsers.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>No matches</Text>
            <Text style={styles.emptyText}>Try a different search.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={item => String(item.id)}
            renderItem={renderUserCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching}
            onRefresh={onRefresh}
          />
        )}

        <UserDetailsModal
          theme={theme}
          user={selectedUser}
          onClose={closeUser}
        />
      </View>
    </View>
  );
};

const UserDetailsModal = ({ user, onClose, theme = 'light' }) => {
  if (!user) return null;
  const colors = theme === 'dark' ? darkColors : lightColors;
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const location = [
    user.address?.address,
    user.address?.city,
    user.address?.stateCode || user.address?.state,
    user.address?.postalCode,
    user.address?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const companyLocation = [
    user.company?.address?.address,
    user.company?.address?.city,
    user.company?.address?.stateCode || user.company?.address?.state,
    user.company?.address?.postalCode,
    user.company?.address?.country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View
        style={[styles.modalBackdrop, { backgroundColor: colors.sheetOverlay }]}
      >
        <View
          style={[
            styles.modalSheet,
            { backgroundColor: colors.sheetBg, borderColor: colors.border },
          ]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text
              style={[styles.modalTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {fullName || 'User Details'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.85}
              style={[styles.modalClose, { backgroundColor: colors.chipBg }]}
            >
              <Text style={[styles.modalCloseText, { color: colors.text }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalTop}>
              <Image source={{ uri: user.image }} style={styles.modalAvatar} />
              <View style={{ flex: 1 }}>
                {!!user.username && (
                  <Text style={[styles.modalHandle, { color: colors.text2 }]}>
                    @{user.username}
                  </Text>
                )}
                <View style={styles.modalChips}>
                  {!!user.gender && (
                    <View style={[styles.chip, styles.chipNeutral]}>
                      <Text style={[styles.chipText, { color: colors.text }]}>
                        {String(user.gender).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  {typeof user.age === 'number' && (
                    <View style={[styles.chip, styles.chipPrimary]}>
                      <Text style={[styles.chipText, styles.chipTextPrimary]}>
                        {user.age}y
                      </Text>
                    </View>
                  )}
                  {!!user.bloodGroup && (
                    <View style={[styles.chip, styles.chipDanger]}>
                      <Text style={[styles.chipText, styles.chipTextDanger]}>
                        {user.bloodGroup}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <Section colors={colors} title="Contact">
              <Field colors={colors} label="Email" value={user.email} />
              <Field colors={colors} label="Phone" value={user.phone} />
            </Section>

            <Section colors={colors} title="Personal">
              <Field
                colors={colors}
                label="Birth Date"
                value={user.birthDate}
              />
              <Field
                colors={colors}
                label="Height"
                value={
                  typeof user.height === 'number'
                    ? `${user.height.toFixed(2)} cm`
                    : ''
                }
              />
              <Field
                colors={colors}
                label="Weight"
                value={
                  typeof user.weight === 'number'
                    ? `${user.weight.toFixed(2)} kg`
                    : ''
                }
              />
              <Field
                colors={colors}
                label="Hair"
                value={[user.hair?.color, user.hair?.type]
                  .filter(Boolean)
                  .join(' • ')}
              />
              <Field colors={colors} label="Eye Color" value={user.eyeColor} />
            </Section>

            <Section colors={colors} title="Address">
              <Field colors={colors} label="Address" value={location} />
              <Field
                colors={colors}
                label="Coordinates"
                value={
                  user.address?.coordinates
                    ? `lat ${user.address.coordinates.lat}, lng ${user.address.coordinates.lng}`
                    : ''
                }
              />
            </Section>

            <Section colors={colors} title="Company">
              <Field
                colors={colors}
                label="Company"
                value={user.company?.name}
              />
              <Field
                colors={colors}
                label="Department"
                value={user.company?.department}
              />
              <Field
                colors={colors}
                label="Title"
                value={user.company?.title}
              />
              <Field
                colors={colors}
                label="Office Address"
                value={companyLocation}
              />
            </Section>

            <Section colors={colors} title="Education">
              <Field
                colors={colors}
                label="University"
                value={user.university}
              />
            </Section>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const Section = ({ title, children, colors }) => (
  <View style={{ marginTop: 14 }}>
    <Text
      style={{
        fontSize: 13,
        fontWeight: '900',
        color: colors.text,
        marginBottom: 8,
      }}
    >
      {title}
    </Text>
    <View
      style={{
        backgroundColor: colors.sectionBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 12,
        gap: 10,
      }}
    >
      {children}
    </View>
  </View>
);

const Field = ({ label, value, colors }) => {
  if (!value) return null;
  return (
    <View style={{ gap: 4 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '900',
          color: colors.text2,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
        {String(value)}
      </Text>
    </View>
  );
};

const makeStyles = c =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    container: { flex: 1, paddingHorizontal: 16, marginTop: hp(8) },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12,
    },
    title: { fontSize: 22, fontWeight: '800', color: c.text },
    subtitle: { marginTop: 2, fontSize: 13, color: c.text2 },

    refreshBtn: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    refreshText: { fontSize: 13, fontWeight: '700', color: c.text },

    searchWrap: { marginBottom: 8 },
    search: {
      height: 44,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: c.inputBg,
      borderWidth: 1,
      borderColor: c.border,
      color: c.text,
      fontSize: 14,
    },

    listContent: { paddingVertical: 10, paddingBottom: 24 },

    card: {
      flexDirection: 'row',
      gap: 12,
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 10,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: c.primaryBg,
    },
    cardBody: { flex: 1 },

    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    name: { flex: 1, fontSize: 16, fontWeight: '800', color: c.text },

    chipsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    chip: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
    },
    chipText: { fontSize: 11, fontWeight: '800', color: c.text },

    chipNeutral: { backgroundColor: c.chipBg, borderColor: c.chipBorder },
    chipPrimary: { backgroundColor: c.primaryBg, borderColor: c.primaryBorder },
    chipTextPrimary: { color: c.primaryText },
    chipDanger: { backgroundColor: c.dangerBg, borderColor: c.dangerBorder },
    chipTextDanger: { color: c.dangerText },

    meta: { marginTop: 2, fontSize: 12, color: c.text2, fontWeight: '600' },

    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 6,
      gap: 8,
    },
    info: { fontSize: 12, color: c.text, fontWeight: '600' },
    dot: { fontSize: 12, color: c.muted, fontWeight: '900' },

    sub: { marginTop: 6, fontSize: 12, color: c.text, fontWeight: '600' },
    location: { marginTop: 2, fontSize: 12, color: c.text2, fontWeight: '600' },

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    centerText: {
      marginTop: 10,
      fontSize: 13,
      color: c.text2,
      fontWeight: '600',
    },

    errorTitle: { fontSize: 16, fontWeight: '800', color: c.text },
    errorText: {
      marginTop: 8,
      fontSize: 13,
      color: c.text2,
      textAlign: 'center',
    },
    retryBtn: {
      marginTop: 14,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: c.btnBg,
    },
    retryText: { color: c.btnText, fontWeight: '800' },

    emptyTitle: { fontSize: 16, fontWeight: '800', color: c.text },
    emptyText: {
      marginTop: 8,
      fontSize: 13,
      color: c.text2,
      textAlign: 'center',
    },

    // Modal
    modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
    modalSheet: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '88%',
      borderWidth: 1,
      overflow: 'hidden',
    },
    modalHeader: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    modalTitle: { flex: 1, fontSize: 16, fontWeight: '900' },
    modalClose: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 },
    modalCloseText: { fontSize: 12, fontWeight: '900' },

    modalContent: { padding: 16, paddingBottom: 26 },
    modalTop: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    modalAvatar: {
      width: 72,
      height: 72,
      borderRadius: 18,
      backgroundColor: c.primaryBg,
    },
    modalHandle: { fontSize: 13, fontWeight: '800' },
    modalChips: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
      flexWrap: 'wrap',
    },
  });

export default AllUsers;
