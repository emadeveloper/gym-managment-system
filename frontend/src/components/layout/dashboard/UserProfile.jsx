import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { userAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../hooks/useToast';
import {
  KeyRound,
  ShieldCheck,
  UserRound,
  UserSquare2,
} from 'lucide-react';

const cardShell = 'rounded-[2rem] border border-gray-700 bg-surface-light p-5 sm:p-6';
const inputShell =
  'w-full rounded-2xl border border-gray-700 bg-surface px-3 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/50';
const labelShell = 'mb-2 block text-xs uppercase tracking-[0.14em] text-gray-500';

function formatName(firstName = '', lastName = '') {
  return `${firstName} ${lastName}`.trim();
}

const UserProfile = ({ user, onLogout }) => {
  const { updateCurrentUser } = useAuth();
  const toast = useToast();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [profileForm, setProfileForm] = useState({
    name: '',
    lastName: '',
    age: '',
    email: '',
    phone: '',
    dni: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const profileTitle = useMemo(() => {
    const fullName = formatName(profileForm.name, profileForm.lastName);
    return fullName || user?.name || 'Mi perfil';
  }, [profileForm.lastName, profileForm.name, user?.name]);

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      if (!user?.id) {
        if (isActive) {
          setLoadingProfile(false);
        }
        return;
      }

      setLoadingProfile(true);
      setErrorMessage('');

      try {
        const response = await userAPI.getById(user.id);
        if (!isActive) {
          return;
        }

        const profileData = response.data;

        setProfileForm({
          name: profileData.name || '',
          lastName: profileData.lastName || '',
          age: profileData.age ? String(profileData.age) : '',
          email: profileData.email || user.email || '',
          phone: profileData.phone || '',
          dni: profileData.dni || '',
        });
      } catch (error) {
        if (isActive) {
          setErrorMessage(error.response?.data?.message || 'No se pudo cargar tu perfil.');
          setProfileForm((current) => ({
            ...current,
            email: user?.email || current.email,
          }));
        }
      } finally {
        if (isActive) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [user?.email, user?.id]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id || !isEditingProfile) {
      return;
    }

    setSavingProfile(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        email: profileForm.email.trim(),
        name: profileForm.name.trim(),
        lastName: profileForm.lastName.trim(),
        age: profileForm.age ? Number(profileForm.age) : null,
        phone: profileForm.phone.trim() || null,
        dni: profileForm.dni.trim() || null,
        password: null,
      };

      const response = await userAPI.update(user.id, payload);
      const updatedProfile = response.data;

      updateCurrentUser({
        ...user,
        id: updatedProfile.id,
        email: updatedProfile.email,
        name: formatName(updatedProfile.name, updatedProfile.lastName) || updatedProfile.email,
        role: updatedProfile.role,
        lastName: updatedProfile.lastName || '',
        age: updatedProfile.age || null,
        phone: updatedProfile.phone || '',
        dni: updatedProfile.dni || '',
      });

      setProfileForm((current) => ({
        ...current,
        name: updatedProfile.name || current.name,
        lastName: updatedProfile.lastName || current.lastName,
        age: updatedProfile.age ? String(updatedProfile.age) : '',
        email: updatedProfile.email || current.email,
        phone: updatedProfile.phone || '',
        dni: updatedProfile.dni || '',
      }));

      setSuccessMessage('Perfil actualizado correctamente.');
      toast.success('Tus datos personales se actualizaron en la base de datos.', 'Perfil actualizado');
      setIsEditingProfile(false);
    } catch (error) {
      const message = error.response?.data?.message || 'No se pudo actualizar el perfil.';
      setErrorMessage(message);
      toast.error(message, 'No se pudo guardar');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEditToggle = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsEditingProfile((current) => !current);
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id) {
      return;
    }

    setSavingPassword(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await userAPI.updatePassword(user.id, passwordForm);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Contraseña actualizada correctamente.');
      toast.success('La contraseña se actualizó correctamente.', 'Seguridad actualizada');
    } catch (error) {
      const message = error.response?.data?.message || 'No se pudo actualizar la contraseña.';
      setErrorMessage(message);
      toast.error(message, 'Error de seguridad');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-gray-700 bg-surface p-5 text-center sm:p-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
          <UserRound className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">{profileTitle}</h1>
        <p className="mt-2 text-sm text-gray-400 sm:text-base">
          Gestioná tus datos personales y mantené tu cuenta siempre actualizada.
        </p>
      </section>

      {errorMessage ? (
        <Card className="rounded-2xl border border-red-600/40 bg-red-900/10 p-4 text-sm text-red-300">
          {errorMessage}
        </Card>
      ) : null}

      {successMessage ? (
        <Card className="rounded-2xl border border-green-600/40 bg-green-900/10 p-4 text-sm text-green-300">
          {successMessage}
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <form onSubmit={handleProfileSubmit} className="xl:col-span-2">
          <Card className={cardShell}>
            <div className="mb-5 flex items-center justify-between border-b border-gray-700 pb-4">
              <h2 className="text-xl font-heading font-bold text-foreground">Datos personales</h2>
              <UserSquare2 className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>

            {loadingProfile ? (
              <p className="text-sm text-gray-400">Cargando perfil...</p>
            ) : (
              <>
                {isEditingProfile ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelShell}>Nombre</label>
                      <input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} className={inputShell} required />
                    </div>

                    <div>
                      <label htmlFor="lastName" className={labelShell}>Apellido</label>
                      <input id="lastName" name="lastName" value={profileForm.lastName} onChange={handleProfileChange} className={inputShell} required />
                    </div>

                    <div>
                      <label htmlFor="age" className={labelShell}>Edad</label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="1"
                        value={profileForm.age}
                        onChange={handleProfileChange}
                        className={inputShell}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelShell}>Teléfono</label>
                      <input id="phone" name="phone" value={profileForm.phone} onChange={handleProfileChange} className={inputShell} required />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="email" className={labelShell}>Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className={inputShell}
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="dni" className={labelShell}>DNI</label>
                      <input id="dni" name="dni" value={profileForm.dni} onChange={handleProfileChange} className={inputShell} required />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Card className="rounded-2xl border border-gray-700 bg-surface p-4">
                      <p className={labelShell}>Nombre</p>
                      <p className="text-base font-semibold text-foreground">{profileForm.name || 'Sin definir'}</p>
                    </Card>
                    <Card className="rounded-2xl border border-gray-700 bg-surface p-4">
                      <p className={labelShell}>Apellido</p>
                      <p className="text-base font-semibold text-foreground">{profileForm.lastName || 'Sin definir'}</p>
                    </Card>
                    <Card className="rounded-2xl border border-gray-700 bg-surface p-4">
                      <p className={labelShell}>Edad</p>
                      <p className="text-base font-semibold text-foreground">{profileForm.age || 'Sin definir'}</p>
                    </Card>
                    <Card className="rounded-2xl border border-gray-700 bg-surface p-4">
                      <p className={labelShell}>Teléfono</p>
                      <p className="text-base font-semibold text-foreground">{profileForm.phone || 'Sin definir'}</p>
                    </Card>
                    <Card className="rounded-2xl border border-gray-700 bg-surface p-4 sm:col-span-2">
                      <p className={labelShell}>Email</p>
                      <p className="text-base font-semibold text-foreground">{profileForm.email || 'Sin definir'}</p>
                    </Card>
                    <Card className="rounded-2xl border border-gray-700 bg-surface p-4 sm:col-span-2">
                      <p className={labelShell}>DNI</p>
                      <p className="text-base font-semibold text-foreground">{profileForm.dni || 'Sin definir'}</p>
                    </Card>
                  </div>
                )}
              </>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant={isEditingProfile ? 'secondary' : 'primary'}
                className="min-h-11 w-full text-sm uppercase font-heading sm:w-auto"
                onClick={handleEditToggle}
                disabled={loadingProfile}
              >
                {isEditingProfile ? 'Cancelar edición' : 'Editar datos'}
              </Button>

              {isEditingProfile ? (
                <Button type="submit" loading={savingProfile} className="min-h-11 w-full text-sm uppercase font-heading">
                  Guardar datos personales
                </Button>
              ) : null}
            </div>
          </Card>
        </form>

        <div className="space-y-4">
          <form onSubmit={handlePasswordSubmit}>
            <Card className={cardShell}>
              <div className="mb-5 flex items-center justify-between border-b border-gray-700 pb-4">
                <h2 className="text-xl font-heading font-bold text-foreground">Seguridad</h2>
                <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="oldPassword" className={labelShell}>Contraseña actual</label>
                  <input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    className={inputShell}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className={labelShell}>Nueva contraseña</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={inputShell}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelShell}>Confirmar nueva contraseña</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className={inputShell}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={savingPassword}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm uppercase font-heading"
              >
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Cambiar contraseña
              </Button>
            </Card>
          </form>

          <Card className="rounded-[2rem] border border-gray-700 bg-surface p-5 sm:p-6">
            <p className="text-sm text-gray-400">
              Si cerrás sesión, vas a necesitar volver a iniciar con tu email y contraseña actualizados.
            </p>
            <Button
              variant="danger"
              className="mt-4 min-h-11 w-full bg-red-600 text-sm uppercase font-heading text-white hover:bg-red-500 active:bg-red-700"
              onClick={onLogout}
            >
              Cerrar sesión
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
