import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

interface ExecutableConfig {
  windows?: string;
  linux?: string;
  darwin?: string;
}

interface Config {
  executables: {
    [key: string]: ExecutableConfig;
  };
}

export interface LaunchResult {
  stdout: string;
  stderr: string;
}

class ExecutableLauncher {
  private config: Config;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    try {
      const CONFIG_FILE_NAME = 'app-launcher-config.json';
      const configPath = path.join(process.cwd(), CONFIG_FILE_NAME);
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('Error loading config:', error);
      return { executables: {} };
    }
  }

  public async launchExecutable(executableName: string, args: string[] = []): Promise<LaunchResult> {
    const platform = os.platform();
    const executablePaths = this.config.executables[executableName];

    if (!executablePaths) {
      throw new Error(`No configuration found for executable: ${executableName}`);
    }

    const executablePath = executablePaths[platform as keyof ExecutableConfig];
    if (!executablePath) {
      throw new Error(`No path configured for platform ${platform} and executable ${executableName}`);
    }

    return new Promise((resolve, reject) => {
      const command = platform === 'darwin' && executablePath.endsWith('.app')
        ? `open "${executablePath}" ${args.join(' ')}`
        : `"${executablePath}" ${args.join(' ')}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ stdout, stderr });
      });
    });
  }

  public getAvailableExecutables(): string[] {
    return Object.keys(this.config.executables);
  }
}

export const executableLauncher = new ExecutableLauncher(); 