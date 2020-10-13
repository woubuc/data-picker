import { inspect } from 'util';

/**
 * A simple type-checking data validator
 */
export default class DataPicker {

	/**
	 * Creates a datapicker for the current environment variables
	 *
	 * Shorthand for `new DataPicker('process.env', process.env)`
	 */
	public static env() : DataPicker {
		return new DataPicker('process.env', process.env);
	}

	private readonly name : string;
	private readonly data : Record<string, unknown>;

	/**
	 * Initialises a new data picker
	 *
	 * @param name - Name of the object, used in error messages
	 * @param data - The data object
	 *
	 * @throws {TypeError} if the given data is not an object
	 */
	public constructor(name : string, data : Record<string, unknown>) {
		if (typeof data !== 'object') {
			throw new TypeError(`Invalid data (expected object, got ${ typeof data }: ${ inspect(data) })`);
		}

		this.name = name;
		this.data = data;
	}

	/**
	 * Checks if the given key exists on the object
	 *
	 * @param key - The property key to check
	 */
	public has(key : string) : boolean {
		return Object.prototype.hasOwnProperty.call(this.data, key);
	}

	/**
	 * Gets the value that corresponds to the given key
	 *
	 * @param key      - The property key to get
	 * @param fallback - If set, returns this value instead of throwing if the key doesn't exist
	 *
	 * @throws {ReferenceError} if the key does not exist
	 */
	public get(key : string, fallback ?: unknown) : unknown {
		if (this.has(key)) {
			return this.data[key];
		}

		if (fallback !== undefined) {
			return fallback;
		}

		throw new ReferenceError(`Missing key ${ key } in ${ this.name }`);
	}

	/**
	 * Get the string value that corresponds to the given key
	 *
	 * @param key      - The property key to get
	 * @param fallback - If set, returns this value instead of throwing if the key doesn't exist
	 *
	 * @throws {ReferenceError} if the key does not exist
	 * @throws {TypeError} if the value is not a string
	 */
	public getString(key : string, fallback ?: string) : string {
		let value = this.get(key, fallback);

		if (typeof value !== 'string') {
			throw new TypeError(`Invalid value for ${ key } in ${ this.name } (expected string, got: ${ inspect(value) })`);
		}

		return value;
	}

	/**
	 * Get the string value that corresponds to the given key, or undefined if the key is not set
	 *
	 * @param key - The property key to get
	 *
	 * @throws {TypeError} if the value is not a string
	 */
	public getStringOptional(key : string) : string | undefined {
		if (!this.has(key)) {
			return undefined;
		}

		return this.getString(key);
	}

	/**
	 * Get the numeric value that corresponds to the given key
	 *
	 * @param key      - The property key to get
	 * @param fallback - If set, returns this value instead of throwing if the key doesn't exist
	 *
	 * @throws {ReferenceError} if the key does not exist
	 * @throws {TypeError} if the value is not a finite number or could not be parsed to a number
	 */
	public getNumber(key : string, fallback ?: number) : number {
		let value = this.get(key, fallback);

		if (typeof value === 'string') {
			if (value.includes('.')) {
				value = Number.parseFloat(value);
			} else {
				value = Number.parseInt(value);
			}
		}

		if (typeof value !== 'number' || !Number.isFinite(value)) {
			throw new TypeError(`Invalid value for ${ key } in ${ this.name } (expected number, got: ${ inspect(value) })`);
		}

		return value;
	}

	/**
	 * Get the numeric value that corresponds to the given key, or undefined if the key is not set
	 *
	 * @param key - The property key to get
	 *
	 * @throws {TypeError} if the value is not a finite number or could not be parsed to a number
	 */
	public getNumberOptional(key : string) : number | undefined {
		if (!this.has(key)) {
			return undefined;
		}

		return this.getNumber(key);
	}

	/**
	 * Get the boolean value that corresponds to the given key
	 *
	 * Non-boolean values will be coerced to a boolean.
	 *
	 * @param key      - The property key to get
	 * @param fallback - If set, returns this value instead of throwing if the key doesn't exist
	 *
	 * @throws {ReferenceError} if the key does not exist
	 */
	public getBoolean(key : string, fallback ?: boolean) : boolean {
		let value = this.get(key, fallback);

		if (typeof value === 'boolean') {
			return value;
		}

		return !!value;
	}

	/**
	 * Get the boolean value that corresponds to the given key, or undefined if the key is not set
	 *
	 * @param key - The property key to get
	 */
	public getBooleanOptional(key : string) : boolean | undefined {
		if (!this.has(key)) {
			return undefined;
		}

		return this.getBoolean(key);
	}

	/**
	 * Get the Date value that corresponds to the given key
	 *
	 * @param key      - The property key to get
	 * @param fallback - If set, returns this value instead of throwing if the key doesn't exist
	 *
	 * @throws {ReferenceError} if the key does not exist
	 * @throws {TypeError} if the value is not a date or could not be parsed to a date
	 */
	public getDate(key : string, fallback ?: Date) : Date {
		let value = this.get(key, fallback);

		if (value instanceof Date) {
			return value;
		}

		if (typeof value === 'string') {
			let parsed = Date.parse(value);

			if (Number.isFinite(parsed) && parsed > 0) {
				return new Date(parsed);
			}
		}

		if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
			return new Date(value);
		}

		throw new TypeError(`Invalid value for ${ key } in ${ this.name } (expected date, got: ${ inspect(value) })`);
	}

	/**
	 * Get the Date value that corresponds to the given key, or undefined if the key is not set
	 *
	 * @param key - The property key to get
	 *
	 * @throws {TypeError} if the value is not a date or could not be parsed to a date
	 */
	public getDateOptional(key : string) : Date | undefined {
		if (!this.has(key)) {
			return undefined;
		}

		return this.getDate(key);
	}

	/**
	 * Gets the array that corresponds to the given key
	 *
	 * @param key      - The property key to get
	 * @param fallback - If set, returns this value instead of throwing if the key doesn't exist
	 *
	 * @throws {ReferenceError} if the key does not exist
	 * @throws {TypeError} if the value is not an array
	 */
	public getArray(key : string, fallback ?: unknown[]) : unknown[] {
		let value = this.get(key, fallback);

		if (!Array.isArray(value)) {
			throw new TypeError(`Invalid value for ${ key } in ${ this.name } (expected array, got: ${ inspect(value) })`);
		}

		return value as unknown[];
	}

	/**
	 * Gets the array of objects that corresponds to the given key
	 *
	 * @param key      - The property key to get
	 * @param fallback - If set, returns this value instead of throwing if the key doesn't exist
	 *
	 * @throws {ReferenceError} if the key does not exist
	 * @throws {TypeError} if the value is not an array
	 * @throws {TypeError} if one of the values in the array is not an object
	 */
	public getObjectArray(key : string, fallback ?: Record<string, any>[]) : DataPicker[] {
		let value = this.getArray(key, fallback);

		return value.map((item, i) => {
			if (typeof item !== 'object' || item === null) {
				throw new TypeError(`Invalid value for ${ key } in ${ this.name } (expected object, got: ${ inspect(value) })`);
			}

			return new DataPicker(`${ this.name }.${ key }[${ i }]`, item as Record<string, unknown>);
		})
	}

	/**
	 * Gets the object that corresponds to the given key
	 *
	 * @param key      - The property key to get
	 * @param fallback - If set, returns this value instead of throwing if the key doesn't exist
	 *
	 * @throws {ReferenceError} if the key does not exist
	 * @throws {TypeError} if the value is not an object
	 */
	public getObject(key : string, fallback ?: Record<string, any>) : DataPicker {
		let value = this.get(key, fallback);

		if (typeof value !== 'object' || value === null) {
			throw new TypeError(`Invalid value for ${ key } in ${ this.name } (expected object, got: ${ inspect(value) })`);
		}

		return new DataPicker(`${ this.name }.${ key }`, value as Record<string, unknown>);
	}

	/**
	 * Gets the object that corresponds to the given key
	 *
	 * @param key      - The property key to get
	 * @param fallback - If set, returns this value instead of throwing if the key doesn't exist
	 *
	 * @throws {ReferenceError} if the key does not exist
	 * @throws {TypeError} if the value is not an object
	 */
	public getRawObject(key : string, fallback ?: unknown) : unknown {
		let value = this.get(key, fallback);

		if (typeof value !== 'object' || value === null) {
			throw new TypeError(`Invalid value for ${ key } in ${ this.name } (expected object, got: ${ inspect(value) })`);
		}

		return value;
	}

	/**
	 * Returns the inner data object of the datapicker
	 */
	public raw() : Record<string, any> {
		return this.data;
	}
}

module.exports = DataPicker;