<?php

namespace App\Http\Requests;

use App\Models\Setting;
use Illuminate\Validation\Rule;

class SettingUpdateRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $setting = $this->route('setting');
        return [
            'name' => ['bail', 'required', 'between:1,30', Rule::unique('settings')->ignore($setting->id)],
            'value' => ['nullable', 'string'],
            'description' => ['nullable', 'string', 'between:2,190'],
            'type_id' => ['bail', 'nullable', 'integer', Rule::exists('types', 'id')->where('model_name', Setting::class)],
        ];
    }

}