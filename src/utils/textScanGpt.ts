import axios from 'axios';

const { removeVietnameseTones } = require('./removeVietnameseTones');

const endpoint = 'https://api.openai.com/v1/chat/completions';

export const promtTaxi = text =>
	`
    Do not add any additional text to the given paragraph

    IMPORTANCE  if nothing in Paragraph "" return "NONE"

    Extract the following information from the given text and return it in JSON format: id usally the first line of number from the text return number only, receipt_serial_number (is the line that have exactly 12 number and dont have "*" with it ),invoice_no (is the line that have exactly 4 number),supllier_name, used_date, used_time, using_person, total_amount (as a number on ly), card_number (the line contain "****"), payment_method, driver_Id, driver_name, plate_number, from, to. If a value is not available, use an empty string. All keys and values should be in lowercase and separated by an underscore and no trailing commas. Please make sure to wrap keys in double quotes.

        Paragraph:
    ` + text;

export const promptIdFront = text =>
	`
    Do not add any additional text to the given paragraph

    IMPORTANCE  if nothing in Paragraph "" return "NONE"

    Extract the following information from the given text and return it in JSON format: Card_ID_Number (usually located after the character ''So:" or "No:" or "số:") ,Full_name(usually located after the character "Họ tên:"or "Ho Ten" or “Name” or “Full Name”) ,Sex, Date_of_birth(usually located after "Ngay thang nam sinh" or "Date Of Birth" or"DOB", make sure it is DD/MM/YYYY), Nationality, Address ,Telephone_number,Date_created,Valid_Until (usually located after "Co gia tri den:" or "Until:" or "EXP:", make sure it is DD/MM/YYYY). If a value is not available, use an empty string. If paragraph is "" in the paragraph return "None". All keys and values should be in lowercase and separated by an underscore. Please make sure to wrap keys in double quotes.
    Paragraph:
    "` +
	text +
	'"' +
	`

    `;

export const promptIdBack = text =>
	`
    Do not add any additional text to the given paragraph

    IMPORTANCE  if nothing in Paragraph "" return "NONE"

    Extract the following information from the given text and return it in JSON format: Date (any Date time information make sure it is DD/MM/YYYY format). If a value is not available, use an empty string. All keys and values should be in lowercase and separated by an underscore. Please make sure to wrap keys in double quotes.


    Paragraph:"` +
	text +
	'"';

export const propmtCardVisit = text =>
	`
    Do not add any additional text to the given paragraph

    IMPORTANCE  if nothing in Paragraph "" return "NONE"

    Extract the following information from the given paragraph: name, personal_phone_number (usually located after the character 'Mobile:'), fax_number, website, personal_email (usually located after the word 'Email:'), company_phone_number (usually located after the characters 'Tel' or 'ĐT'), company_name, company_address, personal_title, and company_tax_code (usually located after the characters 'MST:' or 'Tax code:'). The answer should be in JSON format.  Paragraph:\"` +
	text +
	'"';
/**
 * return Gpt response
 * @param text
 * @returns the text after gpt api
 */
export const responseGPT = async (
	prompt: any,
	model?: string,
): Promise<String> => {
	prompt = removeVietnameseTones(prompt);

	/**
	 * prompt + text input
	 * config body to modify the answer
	 * temperature: control randomess of data 0=no random
	 * max_tokens: max out put length
	 * top_p: only choose word that higher than tis val
	 *
	 */
	let data = '';

	try {
		/**
		 * using the race we can check
		 * wether the api take more than 3 second to load
		 * if it is return ""
		 */

		// known issue auto generate data that does't appear on data
		// known issue auto generate data that does't appear on data
		// known issue auto generate data that does't appear on data
		// known issue auto generate data that does't appear on data
		// known issue auto generate data that does't appear on data
		data = await Promise.race([
			axios.post(
				endpoint,
				{
					model: 'gpt-3.5-turbo',
					messages: [{ role: 'user', content: prompt }],
					temperature: 0,
					max_tokens: 300,
					top_p: 0,
					frequency_penalty: 0,
					presence_penalty: 0,
				},
				{
					headers: {
						Authorization:
							'Bearer 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',
						'Content-Type': 'application/json',
					},
				},
			),
			new Promise((resolve, reject) => {
				setTimeout(() => reject(new Error('Timeout')), 15000);
			}),
		])
			.then((response: any) => {
				// in case the string return have some non json format use this one
				// ((temp).split(temp.indexOf("{")+1,temp.indexOf("}")))[0]
				// console.log(             ((temp).split(temp.indexOf("{")+1,temp.indexOf("}")))[0]

				return JSON.parse(JSON.stringify(response.data)).choices[0].message
					.content;
			})
			.catch(error => {
				console.log(error.message);
				return '';
			});
	} catch (e: any) {
		console.log(e);
		data = '';
	}
	if (data.indexOf('{') == -1) {
		data = '{' + data;
	}
	if (data.indexOf('}') == -1) data = data + '}';
	console.log(prompt, data);
	return data.substring(data.indexOf('{'), data.indexOf('}') + 1);
};
