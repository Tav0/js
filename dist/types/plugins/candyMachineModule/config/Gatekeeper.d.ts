import { GatekeeperConfig } from '@metaplex-foundation/mpl-candy-machine';
import { PublicKeyString } from "../../../types";
/**
 * Configures {@link CandyMachineConfig.gatekeeper} settings.
 *
 * While the unpredictable mint index provides some protection against bots,
 * they are still able to mint directly from the Candy Machine. If you want to
 * make sure that only humans can mint from your project, gatekeeper settings
 * can be enabled.
 *
 * @property gatekeeperNetwork - Gateway provider address
 * @property expireOnUse - Requires a new gateway challenge after a use
 */
export declare type GatekeeperSettingsConfig = {
    gatekeeperNetwork: PublicKeyString;
    expireOnUse: boolean;
};
export declare function gatekeeperFromConfig(config?: GatekeeperSettingsConfig): GatekeeperConfig | undefined;
