import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SessionVaultService } from '../session-vault/session-vault.service';

export const authGuard: CanActivateFn = async (): Promise<boolean> => {
  const sessionVault = inject(SessionVaultService);
  const navController = inject(NavController);

  const session = await sessionVault.get();
  if (session) return true;
  navController.navigateRoot(['./login']);
  return false;
};
