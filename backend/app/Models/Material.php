<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = ['title', 'content', 'module_id'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
