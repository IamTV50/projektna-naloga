package njt.paketnik

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import java.text.SimpleDateFormat
import java.util.Locale

class UnlocksAdapter(context: Context, private val unlocksList: List<UnlocksActivity.Unlock>) : ArrayAdapter<UnlocksActivity.Unlock>(context, R.layout.unlock_item, unlocksList) {
    private val inflater: LayoutInflater = LayoutInflater.from(context)
    private val resources = context.resources

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var view = convertView
        val holder: ViewHolder

        if (view == null) {
            view = inflater.inflate(R.layout.unlock_item, parent, false)
            holder = ViewHolder()
            holder.counter = view.findViewById(R.id.counter)
            holder.unlockNumber = view.findViewById(R.id.unlockNumber)
            holder.unlockDate = view.findViewById(R.id.unlockDate)
            holder.unlockSuccess = view.findViewById(R.id.unlockSuccess)
            holder.unlockReason = view.findViewById(R.id.unlockReason)
            view.tag = holder
        } else {
            holder = view.tag as ViewHolder
        }

        val unlock = unlocksList[position]
        val inputDateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH)
        val outputDateFormat = SimpleDateFormat("dd.MM.yyyy hh:mm:ss", Locale.ENGLISH)

        holder.counter?.text =  (position + 1).toString()
        holder.unlockNumber?.text = resources.getString(R.string.packagerNumber, unlock.number.toString())
        holder.unlockDate?.text = resources.getString(R.string.unlockDate, inputDateFormat.parse(unlock.date)?.let { outputDateFormat.format(it) } ?: "")
        if (unlock.success) {
            holder.unlockSuccess?.setBackgroundResource(R.drawable.badge_success)
            holder.unlockSuccess?.text = "Opened"
            holder.unlockSuccess?.visibility = View.VISIBLE
            holder.unlockSuccess?.setTextColor(context.resources.getColor(R.color.badge_success_text_light, null))
        } else {
            holder.unlockSuccess?.setBackgroundResource(R.drawable.badge_failed)
            holder.unlockSuccess?.text = "Failed"
            holder.unlockSuccess?.visibility = View.VISIBLE
            holder.unlockSuccess?.setTextColor(context.resources.getColor(R.color.badge_failed_text_light, null))
        }
//        holder.unlockSuccess?.text = resources.getString(R.string.unlockSuccess, if (unlock.success) "Successfully" else "Unsuccessfully")
        holder.unlockReason?.text = unlock.reason

        return view!!
    }

    private class ViewHolder {
        var counter: TextView? = null
        var unlockNumber: TextView? = null
        var unlockDate: TextView? = null
        var unlockSuccess: TextView? = null
        var unlockReason: TextView? = null
    }
}