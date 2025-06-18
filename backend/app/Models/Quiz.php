<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'module_id', 'question', 'options', 'answer'
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
